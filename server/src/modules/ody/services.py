import csv
import io
from urllib.parse import urlparse

from .odify import search_and_scrape
from .google_places import search_without_website as _search_places

_results_store = {}


def run_search(query: str, max_results: int):
    data = search_and_scrape(query, max_results)
    session_id = str(id(data))
    _results_store[session_id] = data
    return session_id, data


def run_search_places(niche: str, location: str, max_results: int = 30):
    data = _search_places(niche, location, max_results)
    session_id = str(id(data))
    _results_store[session_id] = data
    return session_id, data


def get_results(session_id: str):
    return _results_store.get(session_id, [])


def generate_csv(session_id: str):
    results = get_results(session_id)
    buf = io.StringIO()
    writer = csv.writer(buf)

    if not results:
        return buf.getvalue()

    first = results[0]
    if "name" in first:
        writer.writerow(["Business Name", "Phone", "Address", "Email", "Website"])
        for r in results:
            writer.writerow([
                r.get("name", ""),
                r.get("phone", ""),
                r.get("address", ""),
                r.get("email", ""),
                r.get("website", ""),
            ])
    else:
        writer.writerow(["URL", "Emails", "Phones"])
        for r in results:
            writer.writerow([
                r["url"],
                ", ".join(r["emails"]),
                ", ".join(r["phones"]),
            ])
    return buf.getvalue()


def generate_vcard(name: str, emails: list, phones: list):
    lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        f"FN:{name}",
    ]
    for e in emails:
        lines.append(f"EMAIL:{e}")
    for p in phones:
        lines.append(f"TEL:{p}")
    lines.append("END:VCARD")
    return "\n".join(lines)


def generate_vcard_for_result(result: dict):
    if "name" in result:
        name = result.get("name", "Unknown")
        phones = [result["phone"]] if result.get("phone") else []
        emails = [result["email"]] if result.get("email") else []
        return generate_vcard(name, emails, phones)
    url = result.get("url", "")
    parsed = urlparse(url)
    name = parsed.netloc.replace("www.", "")
    return generate_vcard(name, result.get("emails", []), result.get("phones", []))


def generate_all_vcards(session_id: str):
    results = get_results(session_id)
    vcards = []
    for r in results:
        vcards.append(generate_vcard_for_result(r))
    return "\n".join(vcards)
