from fastapi import FastAPI, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from src.model.ody.services import (
    run_search,
    generate_csv,
    generate_vcard_for_result,
    generate_all_vcards,
    get_results,
)

buildApp = FastAPI(title="Odify API")

buildApp.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@buildApp.get("/")
def health():
    return {"ok": True, "app": "Odify API"}


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
