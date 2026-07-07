from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles

from src.model.ody.services import (
    run_search,
    generate_csv,
    generate_vcard_for_result,
    generate_all_vcards,
)

buildApp = FastAPI()

templates = Jinja2Templates(directory="src/templates")


@buildApp.get("/", response_class=HTMLResponse)
def index(request: Request):
    return templates.TemplateResponse(request, "index.html")


@buildApp.post("/search")
def search(
    niche: str = Form(...),
    country: str = Form(...),
    max_results: int = Form(10),
):
    query = f"{niche} in {country}"
    session_id, data = run_search(query, max_results)
    return {
        "session_id": session_id,
        "results": [
            {
                "url": r["url"],
                "emails": r["emails"],
                "phones": r["phones"],
                "emails_str": ", ".join(r["emails"]),
                "phones_str": ", ".join(r["phones"]),
            }
            for r in data
        ],
    }


@buildApp.get("/download/csv/{session_id}")
def download_csv(session_id: str):
    csv_data = generate_csv(session_id)
    return PlainTextResponse(
        csv_data,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=leads.csv"},
    )


@buildApp.get("/download/vcard/{session_id}/{idx}")
def download_vcard(session_id: str, idx: int):
    from src.model.ody.services import get_results

    results = get_results(session_id)
    if idx < 0 or idx >= len(results):
        return PlainTextResponse("Not found", status_code=404)
    vcard = generate_vcard_for_result(results[idx])
    return PlainTextResponse(
        vcard,
        media_type="text/vcard",
        headers={"Content-Disposition": f"attachment; filename=lead_{idx}.vcf"},
    )


@buildApp.get("/download/all-vcards/{session_id}")
def download_all_vcards(session_id: str):
    vcards = generate_all_vcards(session_id)
    return PlainTextResponse(
        vcards,
        media_type="text/vcard",
        headers={"Content-Disposition": "attachment; filename=all_leads.vcf"},
    )
