#!/usr/bin/env python3
import time
from typing import List, Optional, Set, Tuple

from camoufox.sync_api import Camoufox
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from auth import get_current_user_optional
from crawler import (
    CrawlRequest,
    build_proxy_config,
    extract_data,
    get_links,
    get_match_teams,
    get_odds_native,
    watch_odds,
)
from db import AnonymousUsage, UserDB, get_db

router = APIRouter()

FREE_REQUEST_LIMIT = 1   # сколько запросов разрешено гостю
FREE_RESULT_LIMIT = 5    # сколько строк отдаём гостю в каждом списке


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host


def check_and_increment_anon_usage(ip: str, db: Session):
    """Пускает гостя один раз; на второй запрос с того же IP — 403."""
    usage = db.query(AnonymousUsage).filter(AnonymousUsage.ip == ip).first()

    if usage and usage.request_count >= FREE_REQUEST_LIMIT:
        raise HTTPException(
            status_code=403,
            detail="Бесплатный лимит исчерпан (1 запрос). Зарегистрируйтесь, чтобы продолжить.",
        )

    if usage:
        usage.request_count += 1
    else:
        usage = AnonymousUsage(ip=ip, request_count=1)
        db.add(usage)

    db.commit()


def limit_payload(payload: dict, max_rows: int) -> dict:
    """Обрезает JSON для гостя: первые N страниц, N матчей, N рынков коэффициентов."""
    limited_results = []

    for page_result in payload["results"][:max_rows]:
        limited = dict(page_result)

        if "matches" in limited:
            limited["matches"] = limited["matches"][:max_rows]

        if "live" in limited and limited["live"].get("snapshot"):
            limited["live"] = {
                **limited["live"],
                "snapshot": limited["live"]["snapshot"][:max_rows],
            }

        limited_results.append(limited)

    return {**payload, "results": limited_results, "limited": True}


def _open_first_match(page):
    try:
        card = page.locator(".lv_event_card").nth(0)
        target = card.locator("[class*='team'],[class*='participant'],[class*='name']").first
        (target if target.count() > 0 else card).click(timeout=10000)

        page.wait_for_selector(".dg_lv_stake_factor_new", timeout=25000, state="attached")
        time.sleep(2)

        headers = page.locator(".dg_collapse.dg_lv_stake_collapse")
        for i in range(headers.count()):
            try:
                header = headers.nth(i)
                header.scroll_into_view_if_needed(timeout=1000)
                header.click(timeout=500, force=True)
            except Exception:
                continue

        time.sleep(2)
    except Exception as e:
        print("MATCH OPEN ERROR:", e)


def _crawl_page(page, request: CrawlRequest, current_url: str) -> dict:
    if request.homepage:
        page.goto(str(request.homepage), timeout=60000, wait_until="domcontentloaded")
        time.sleep(5)

    page.goto(current_url, timeout=60000, wait_until="commit")
    time.sleep(5)

    if request.wait_selector:
        try:
            page.wait_for_selector(request.wait_selector, timeout=45000)
        except Exception:
            pass

    try:
        page.wait_for_selector(".lv_event_card", timeout=45000)
    except Exception:
        pass

    matches = get_match_teams(page)
    _open_first_match(page)

    try:
        odds = get_odds_native(page)
    except Exception as e:
        print("ODDS ERROR:", e)
        odds = []

    live_data = (
        watch_odds(page, request.live_interval, request.live_rounds)
        if request.live
        else {"snapshot": odds, "changes": []}
    )

    data = extract_data(page, request.selectors, request.list_selector)
    return {"matches": matches, "live": live_data, "data": data}


@router.post("/crawl")
def crawl(
    request: CrawlRequest,
    http_request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[UserDB] = Depends(get_current_user_optional),
):
    if current_user is None:
        check_and_increment_anon_usage(get_client_ip(http_request), db)

    visited: Set[str] = set()
    to_visit: List[Tuple[str, int]] = [(str(request.url), 0)]
    all_results = []

    try:
        with Camoufox(
            headless=True,
            proxy=build_proxy_config(request.proxy),
            os="windows",
            block_webrtc=True,
            i_know_what_im_doing=True,
        ) as browser:
            context = browser.new_context(locale="en-US", viewport={"width": 1920, "height": 1080})
            page = context.new_page()

            while to_visit and len(visited) < request.max_pages:
                current_url, current_depth = to_visit.pop(0)
                if current_url in visited:
                    continue

                try:
                    page_result = _crawl_page(page, request, current_url)
                except Exception as e:
                    print("PAGE ERROR:", e)
                    continue

                visited.add(current_url)
                all_results.append({"url": current_url, "depth": current_depth, **page_result})

                if current_depth < request.depth:
                    for link in get_links(page, current_url, request.same_domain_only):
                        if link not in visited:
                            to_visit.append((link, current_depth + 1))

            context.close()

        payload = {"pages_crawled": len(visited), "results": all_results}

        if current_user is None:
            payload = limit_payload(payload, FREE_RESULT_LIMIT)

        return payload

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))