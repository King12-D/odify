# Odify

A lead generation tool with a web UI. Searches for businesses in a specific niche and country, scrapes their contact info (email & phone), and lets you download as CSV or vCard (saves directly to contacts).

## Quick Start

### CLI version
```bash
cd server
python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt
# edit .env → python src/model/ody/odify.py
```

### Web UI
```bash
cd server
source venv/bin/activate
uvicorn main:buildApp --reload --port 8000
```

Open http://localhost:8000 — input your niche + country, hit Search, and:
- Copy any email or phone with one click
- Download all as CSV
- Download as vCard (`.vcf`) — opening this saves the contact to your address book

## Project Structure

```
├── server/
│   ├── .env
│   ├── main.py              # FastAPI entry point
│   ├── appSetup.py           # Routes
│   ├── requirements.txt
│   ├── src/
│   │   ├── templates/
│   │   │   └── index.html    # Web UI
│   │   └── model/ody/
│   │       ├── odify.py      # Scraper core
│   │       └── services.py   # CSV/vCard generation
│   └── output/
├── client/                   # (future use)
├── LICENSE
└── README.md
```
