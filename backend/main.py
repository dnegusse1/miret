from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, init_db
from models import Price, Crop, Market
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from weather import get_weather_data, get_seeding_recommendation

app = FastAPI(
    title="Miret API",
    description="Ethiopian Agricultural Market Price Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup():
    init_db()

class PriceSubmission(BaseModel):
    crop_name: str
    market: str
    region: str
    price_etb: float
    unit: Optional[str] = "quintal"
    submitted_by: Optional[str] = None

@app.get("/")
def root():
    return JSONResponse(
        content={
            "app": "Miret - ምርት",
            "tagline": "ዋጋ ይወቁ — Know your price",
            "version": "1.0.0",
            "status": "running"
        },
        media_type="application/json; charset=utf-8"
    )

@app.get("/health")
def health():
    return JSONResponse(
        content={"status": "healthy"},
        media_type="application/json; charset=utf-8"
    )

@app.get("/prices")
def get_prices(
    region: Optional[str] = None,
    crop: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Price).filter(Price.is_verified == True)
    if region:
        query = query.filter(Price.region == region)
    if crop:
        query = query.filter(Price.crop_name == crop)
    prices = query.order_by(Price.created_at.desc()).limit(50).all()
    return prices


@app.post("/prices")
def submit_price(submission: PriceSubmission, db: Session = Depends(get_db)):
    price = Price(
        crop_name=submission.crop_name,
        market=submission.market,
        region=submission.region,
        price_etb=submission.price_etb,
        unit=submission.unit,
        submitted_by=submission.submitted_by,
        is_verified=True
    )
    db.add(price)
    db.commit()
    db.refresh(price)
    return {"message": "Price submitted successfully", "id": price.id}

@app.get("/crops")
def get_crops(db: Session = Depends(get_db)):
    return db.query(Crop).filter(Crop.is_active == True).all()

@app.get("/markets")
def get_markets(db: Session = Depends(get_db)):
    return db.query(Market).filter(Market.is_active == True).all()

@app.get("/weather/{region}")
async def get_weather(region: str):
    data = await get_weather_data(region)
    if not data:
        raise HTTPException(status_code=404, detail="Region not found")
    return data

@app.get("/seeding/{region}/{crop}")
async def get_seeding_advice(region: str, crop: str):
    weather = await get_weather_data(region)
    if not weather:
        raise HTTPException(status_code=404, detail="Region not found")
    recommendation = get_seeding_recommendation(crop, weather)
    return {
        "region": region,
        "crop": crop,
        "weather": weather,
        "recommendation": recommendation
    }