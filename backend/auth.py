import random
import string
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "miret-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Email settings
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_USER = os.getenv("EMAIL_USER", "")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

def generate_otp():
    return "".join(random.choices(string.digits, k=6))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            return None
        return email
    except JWTError:
        return None

def send_otp_email(email: str, otp: str):
    # For testing — just print OTP if no email configured
    if not EMAIL_USER or not EMAIL_PASSWORD:
        print(f"TEST MODE — OTP for {email}: {otp}")
        return True

    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_USER
        msg["To"] = email
        msg["Subject"] = "Your Miret Login Code"

        body = f"""
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto;">
            <div style="background: #1a7a4a; padding: 20px; text-align: center;">
                <h1 style="color: #fff; margin: 0;">ምርት Miret</h1>
            </div>
            <div style="padding: 30px; background: #f9f9f9;">
                <h2>Your Login Code</h2>
                <div style="font-size: 36px; font-weight: bold; color: #1a7a4a; 
                            text-align: center; padding: 20px; background: #fff;
                            border-radius: 8px; letter-spacing: 8px;">
                    {otp}
                </div>
                <p style="color: #888; font-size: 13px; margin-top: 20px;">
                    This code expires in 10 minutes. Do not share it with anyone.
                </p>
            </div>
        </div>
        """

        msg.attach(MIMEText(body, "html"))
        server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True

    except Exception as e:
        print(f"Email error: {e}")
        return False

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    if not credentials:
        return None
    email = verify_token(credentials.credentials)
    if not email:
        return None
    user = db.query(User).filter(User.email == email).first()
    return user

def get_required_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user = get_current_user(credentials, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return user