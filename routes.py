from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def home():
    return {"message": "Quantix backend is alive!"}

@router.get("/health")
def health():
    return {
        "status": "ok",
        "project": "quantix"
    }

@router.get("/scraped-data")
def scrapedData():
    return {
        "data": {
            "item": "phone",
            "price": "100$"
        },
        "scraped_at": "2026-07-22"
    }