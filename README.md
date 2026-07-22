# Quantix

> A powerful tool for extracting structured data from web sources.

## 📌 About the Project

Quantix is a web data extraction platform that allows users to collect specific information from different websites.

The idea behind Quantix is simple: instead of manually searching and copying information, users can define what data they need and get it automatically.

## 🚀 Features

- Extract data from web pages
- Flexible data selectors
- Support for multiple sources
- Fast and automated information collection
- Structured output of extracted data

## 💡 Use Cases

Quantix can be used for:

- Monitoring product prices
- Collecting public information from websites
- Comparing data from different sources
- Automating repetitive research tasks
- Gathering information for analysis

## ⚙️ How It Works

1. User provides a website URL
2. User defines required data fields
3. Quantix analyzes the page structure
4. The system extracts required information
5. Data is returned in a structured format

## Usage

This script prints a status report for the Quantix project, showing which
components are done and which are still TODO.

Run it with:

```bash
python3 main.py
```

Or, if it's executable:

```bash
./main.py
```

The script exits with a code equal to the number of components still
remaining (0 means everything is ready).

## Backend

The backend is built with **FastAPI**.

- `GET /` — home route, returns a welcome message about the project status.
- `GET /health` — health-check route, returns JSON like `{"status": "ok", "project": "quantix"}`.
- `GET /scraped-data` — project-specific route, returns scraped data as JSON.

## Running

Install dependencies and start the server:

\`\`\`bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

Once running:
- Home page: http://127.0.0.1:8000
- Health check: http://127.0.0.1:8000/health
- Interactive docs (Swagger): http://127.0.0.1:8000/docs
- Specific route: http://127.0.0.1:8000/scraped-data