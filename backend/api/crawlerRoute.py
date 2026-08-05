#!/usr/bin/env python3
"""
api/crawlerRoute.py — FastAPI роуты для запуска краулера Quantix.
Специфичная логика (матчи, live-коэффициенты) — здесь.
Общие переиспользуемые функции — в crawler.py.
"""

import time
from typing import List, Set, Tuple

from camoufox.sync_api import Camoufox
from fastapi import APIRouter, HTTPException

from crawler import (
    CrawlRequest,
    build_proxy_config,
    extract_data,
    get_links,
    get_match_teams,
    get_odds_native,
    watch_odds,
)

router = APIRouter()


def _open_first_match(page):
    """
    Открывает первую карточку матча на странице, дожидается появления коэффициентов
    и раскрывает все свёрнутые секции — без этого get_odds_native() видит пустой DOM,
    т.к. секции по умолчанию свёрнуты (это и было причиной пустого live.snapshot).
    """
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

        time.sleep(2)  # даём время подгрузиться данным по вебсокету после раскрытия
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
def crawl(request: CrawlRequest):
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

        return {"pages_crawled": len(visited), "results": all_results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))