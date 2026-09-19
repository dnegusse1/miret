from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, init_db
from models import Price, Crop, Market, User
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from weather import get_weather_data, get_seeding_recommendation
from esx import get_esx_prices, get_usd_etb_rate
from auth import generate_otp, create_access_token, send_otp_email, get_current_user

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

class RequestOTP(BaseModel):
    email: str

class VerifyOTP(BaseModel):
    email: str
    otp: str

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

@app.get("/finance/stocks")
async def get_stocks():
    return get_esx_prices()

@app.get("/finance/exchange-rate")
async def get_exchange_rate():
    return get_usd_etb_rate()

@app.post("/auth/request-otp")
def request_otp(body: RequestOTP, db: Session = Depends(get_db)):
    email = body.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email)
        db.add(user)
    otp = generate_otp()
    user.otp_code = otp
    user.otp_expires = datetime.utcnow() + timedelta(minutes=10)
    db.commit()
    send_otp_email(email, otp)
    return {"message": "OTP sent to your email", "email": email}

@app.post("/auth/verify-otp")
def verify_otp(body: VerifyOTP, db: Session = Depends(get_db)):
    email = body.email.lower().strip()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user.otp_code or user.otp_code != body.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if datetime.utcnow() > user.otp_expires:
        raise HTTPException(status_code=400, detail="OTP expired")
    user.otp_code = None
    user.otp_expires = None
    user.is_verified = True
    user.last_login = datetime.utcnow()
    db.commit()
    token = create_access_token({"sub": email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "email": email,
        "is_trader": user.is_trader
    }

@app.get("/auth/me")
def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_trader": current_user.is_trader,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at
    }