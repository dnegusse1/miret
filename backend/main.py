from datetime import timedelta

class RequestOTP(BaseModel):
    email: str

class VerifyOTP(BaseModel):
    email: str
    otp: str

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