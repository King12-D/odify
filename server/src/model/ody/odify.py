import re
import time

import requests
from bs4 import BeautifulSoup
from ddgs import DDGS

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/125.0.0.0 Safari/537.36"
    )
}

EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
PHONE_REGEX = re.compile(
    r"(?:(?:\+?1)?[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
)


def extract_emails(text):
    return list(set(EMAIL_REGEX.findall(text)))


def extract_phones(text):
    raw = PHONE_REGEX.findall(text)
    cleaned = []
    for p in raw:
        digits = re.sub(r"\D", "", p)
        if len(digits) >= 10:
            cleaned.append(p.strip())
    return list(set(cleaned))


def scrape_page(url):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        text = soup.get_text(separator=" ", strip=True)
        emails = extract_emails(text)
        phones = extract_phones(text)
        return emails, phones
    except Exception:
        return [], []


def search_and_scrape(query, max_results=10):
    urls = []
    with DDGS() as ddgs:
        for r in ddgs.text(query, max_results=max_results):
            urls.append(r["href"])

    results = []
    for url in urls:
        emails, phones = scrape_page(url)
        results.append({
            "url": url,
            "emails": emails,
            "phones": phones,
        })
        time.sleep(1)

    return results
