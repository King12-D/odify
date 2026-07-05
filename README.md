# Odify

A lead generation tool that searches the web for businesses in a specific niche and country, scrapes their contact info (email & phone), and saves it to a CSV file.

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Usage

1. Edit `.env` to configure your search:

```
SEARCH_QUERY="plumber in"
COUNTRY="USA"
MAX_RESULTS=10
OUTPUT_FILE="output/leads.csv"
```

2. Run the scraper:

```bash
source venv/bin/activate
python src/scraper.py
```

Results are saved to `output/leads.csv`.

## Project Structure

```
├── .env              # Configuration
├── src/
│   └── scraper.py    # Main scraper
├── output/           # CSV output directory
├── requirements.txt
├── LICENSE
└── README.md
```
