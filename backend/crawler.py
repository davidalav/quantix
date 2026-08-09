#!/usr/bin/env python3
"""
crawler.py — основная логика краулинга для Quantix.

Только бизнес-логика: конфигурация запроса, обход сайта, извлечение данных.
Никакого FastAPI здесь — роуты живут в api/crawlerRoute.py.
"""

import time
from typing import Dict, List, Optional, Set, Tuple
from urllib.parse import urlparse

from camoufox.sync_api import Camoufox
from pydantic import BaseModel, HttpUrl


class CrawlRequest(BaseModel):
    url: HttpUrl
    homepage: Optional[HttpUrl] = None
    depth: int = 0
    selectors: Dict[str, str]
    list_selector: Optional[str] = None
    wait_selector: Optional[str] = None
    same_domain_only: bool = True
    max_pages: int = 50
    proxy: Optional[str] = None
    wait_seconds: float = 2.0  # пауза после загрузки — даёт время подгрузиться JS-контенту
    live: bool = False
    live_interval: float = 2.0
    live_rounds: int = 5

    # универсальный табличный режим — для сайтов без семантических классов
    # (курсы валют, прайс-листы, каталоги и т.п. на Tailwind-утилитах)
    table_mode: bool = False
    table_row_selector: Optional[str] = None
    table_cell_selector: Optional[str] = None
    table_header_selector: Optional[str] = None
    table_label_selector: Optional[str] = None


def build_proxy_config(proxy_url: Optional[str]) -> Optional[dict]:
    """Превращает строку прокси (http://user:pass@host:port) в формат, который ждёт Camoufox."""
    if not proxy_url or proxy_url == "string":
        return None
    parsed = urlparse(proxy_url)
    config = {"server": f"{parsed.scheme}://{parsed.hostname}:{parsed.port}"}
    if parsed.username:
        config["username"] = parsed.username
    if parsed.password:
        config["password"] = parsed.password
    return config


def extract_data(page, selectors: Dict[str, str], list_selector: Optional[str]):
    """
    Извлекает данные со страницы по CSS-селекторам.
    Если задан list_selector — возвращает список объектов (например, карточки товаров).
    Иначе — один объект с полями страницы.
    """
    if list_selector:
        items = page.query_selector_all(list_selector)
        results = []
        for item in items:
            row = {}
            for field, selector in selectors.items():
                el = item.query_selector(selector)
                row[field] = el.inner_text().strip() if el else None
            results.append(row)
        return results

    return {
        field: (page.query_selector(selector).inner_text().strip() if page.query_selector(selector) else None)
        for field, selector in selectors.items()
    }


def extract_table(
    page,
    row_selector: str,
    cell_selector: str,
    header_selector: Optional[str] = None,
    label_selector: Optional[str] = None,
) -> List[dict]:
    """
    Универсальный экстрактор табличных данных — работает на любом сайте
    с повторяющейся структурой "строка -> набор ячеек с одинаковым классом",
    даже если у ячеек нет уникальных семантических классов (только Tailwind-утилиты).

    row_selector    — селектор одной строки таблицы (например, ".flex.h-12...")
    cell_selector   — селектор ячейки со значением ВНУТРИ строки (например, ".relative.flex.z-1...")
    header_selector — опционально: селектор заголовков колонок (чтобы подписать значения по именам)
    label_selector  — опционально: селектор "подписи" строки (например, название организации)

    Некоторые сайты рендерят первую колонку (например, название банка) ОТДЕЛЬНЫМ
    параллельным DOM-деревом — "замороженная" колонка, визуально выровненная с
    остальной таблицей через CSS, но структурно НЕ вложенная в те же строки.
    В этом случае label_selector внутри row ничего не находит. Фоллбэк: ищем
    подписи на уровне всей страницы и сопоставляем их по порядковому индексу
    со строками — работает, если число подписей совпадает с числом строк.
    """
    headers = None
    if header_selector:
        headers = [el.inner_text().strip() for el in page.query_selector_all(header_selector)]

    rows = page.query_selector_all(row_selector)

    page_labels = None
    if label_selector:
        page_labels = [el.inner_text().strip() for el in page.query_selector_all(label_selector)]

    results = []

    for idx, row in enumerate(rows):
        values = [el.inner_text().strip() for el in row.query_selector_all(cell_selector)]

        label = None
        if label_selector:
            label_el = row.query_selector(label_selector)
            if label_el:
                label = label_el.inner_text().strip()
            elif page_labels and idx < len(page_labels):
                label = page_labels[idx]

        if headers and len(headers) == len(values):
            row_data = dict(zip(headers, values))
        else:
            row_data = {"values": values}

        if label is not None:
            row_data = {"label": label, **row_data}

        results.append(row_data)

    return results


def get_links(page, base_url: str, same_domain_only: bool) -> List[str]:
    """Собирает все ссылки на странице, при необходимости фильтруя по домену."""
    links = page.eval_on_selector_all("a[href]", "els => els.map(e => e.href)")
    if same_domain_only:
        base_domain = urlparse(base_url).netloc
        links = [l for l in links if urlparse(l).netloc == base_domain]
    return list(set(links))


def get_match_teams(page) -> List[dict]:
    """
    Список матчей (названия команд) с текущей страницы со списком событий.
    Селектор ловит и заголовок карточки целиком ("КомандаAКомандаB"), и повторы
    (лого/текст/моб. версия) — поэтому чистим: убираем точные дубли через Set,
    затем убираем строки, которые являются конкатенацией других строк из того же набора.
    """
    return page.eval_on_selector_all(".lv_event_card", """
        els => els.map(el => {
            const raw = Array.from(el.querySelectorAll("[class*='team'],[class*='participant'],[class*='name']"))
                .map(n => n.textContent.trim())
                .filter(Boolean);
            const unique = [...new Set(raw)];
            const teams = unique.filter(name =>
                !unique.some(other => other !== name && name.includes(other))
            );
            return { teams: teams.length ? teams : unique };
        })
    """)


def get_odds_native(page) -> List[dict]:
    """
    Снимок текущих коэффициентов на странице открытого матча.

    Виджет коэффициентов сидит в web components (shadow DOM). page.evaluate() с сырым JS
    использует нативный document.querySelectorAll, который shadow DOM НЕ пробивает — из-за
    этого snapshot был пустым. query_selector_all() — это уже метод самого Playwright,
    а его CSS-движок пробивает open shadow root автоматически (так же, как в get_match_teams).
    """
    sections = page.query_selector_all(".dg_collapse.dg_lv_stake_collapse")
    results = []

    for idx, section in enumerate(sections):
        header = section.query_selector("[class*='header'],[class*='title'],[class*='name']")
        market_name = header.inner_text().strip() if header else f"Market_{idx}"

        names = [el.inner_text().strip() for el in section.query_selector_all(".dg_lv_stake_arg_name")]
        params = [el.inner_text().strip() for el in section.query_selector_all(".dg_lv_stake_param, .dg_lv_stake_value")]
        factors = [el.inner_text().strip() for el in section.query_selector_all(".dg_lv_stake_factor_new")]

        odds = {}
        for i, name in enumerate(names):
            factor = factors[i] if i < len(factors) else None
            if name and factor:
                param = params[i] if i < len(params) else ""
                outcome = f"{name} {param}".strip() if param else name
                odds[outcome] = factor

        if odds:
            results.append({"market": market_name, "odds": odds})

    return results


def watch_odds(page, interval: float, rounds: int) -> dict:
    """
    Несколько раз подряд опрашивает коэффициенты (polling) и собирает список изменений.
    Проще и надёжнее, чем MutationObserver + expose_binding — не требует асинхронного моста
    между JS и Python и не блокирует поток бесконечным while True.
    """
    snapshot = get_odds_native(page)
    previous = {(m["market"], outcome): value for m in snapshot for outcome, value in m["odds"].items()}
    changes = []

    for _ in range(rounds):
        time.sleep(interval)
        current = get_odds_native(page)
        current_map = {(m["market"], outcome): value for m in current for outcome, value in m["odds"].items()}

        for key, new_value in current_map.items():
            old_value = previous.get(key)
            if old_value is not None and old_value != new_value:
                changes.append({"market": key[0], "outcome": key[1], "old": old_value, "new": new_value})
        previous = current_map

    return {"snapshot": snapshot, "changes": changes}


def run_crawl(request: CrawlRequest) -> dict:
    """
    Простой обход сайта только по selectors/list_selector, без работы с матчами и live-коэффициентами.
    Используется как база — специфичная логика (матчи, коэффициенты, таблицы) живёт в api/crawlerRoute.py.
    """
    visited: Set[str] = set()
    to_visit: List[Tuple[str, int]] = [(str(request.url), 0)]
    all_results = []

    proxy_config = build_proxy_config(request.proxy)

    with Camoufox(
        headless=True,
        proxy=proxy_config,
        os="windows",
        block_webrtc=True,
        i_know_what_im_doing=True,
    ) as browser:
        context = browser.new_context(
            locale="en-US",
            viewport={"width": 1920, "height": 1080},
        )
        page = context.new_page()

        try:
            while to_visit and len(visited) < request.max_pages:
                current_url, current_depth = to_visit.pop(0)
                if current_url in visited:
                    continue

                try:
                    page.goto(current_url, timeout=30000, wait_until="domcontentloaded")
                    time.sleep(request.wait_seconds)
                except Exception:
                    continue

                visited.add(current_url)
                data = extract_data(page, request.selectors, request.list_selector)
                all_results.append({"url": current_url, "depth": current_depth, "data": data})

                if current_depth < request.depth:
                    for link in get_links(page, current_url, request.same_domain_only):
                        if link not in visited:
                            to_visit.append((link, current_depth + 1))
        finally:
            context.close()

    return {"pages_crawled": len(visited), "results": all_results}