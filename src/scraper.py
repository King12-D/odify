import csv
import re
import time
import os
from urllib.parse import urlparse, urljoin

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from ddgs import DDGS

load_dotenv()

SEARCH_QUERY = os.getenv("SEARCH_QUERY", "plumber in")
COUNTRY = os.getenv("COUNTRY", "USA")
MAX_RESULTS = int(os.getenv("MAX_RESULTS", 10))
OUTPUT_FILE = os.getenv("OUTPUT_FILE", "leads.csv")

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


def main():
    query = f"{SEARCH_QUERY} {COUNTRY}"
    print(f"[*] Searching: {query}")
    print(f"[*] Max results: {MAX_RESULTS}")

    urls = []
    try:
        with DDGS() as ddgs:
            for r in ddgs.text(query, max_results=MAX_RESULTS):
                urls.append(r["href"])
    except Exception as e:
        print(f"[!] Search failed: {e}")
        return

    print(f"[*] Found {len(urls)} URLs")

    results = []
    for i, url in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] Scraping: {url}")
        emails, phones = scrape_page(url)
        results.append({
            "url": url,
            "emails": ", ".join(emails) if emails else "",
            "phones": ", ".join(phones) if phones else "",
        })
        time.sleep(1)

    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["url", "emails", "phones"])
        writer.writeheader()
        writer.writerows(results)

    print(f"\n[✓] Done! {len(results)} leads saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
