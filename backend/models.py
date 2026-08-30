from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Price(Base):
    __tablename__ = "prices"

    id              = Column(Integer, primary_key=True, index=True)
    crop_name       = Column(String, nullable=False)
    crop_name_am    = Column(String, nullable=True)
    market          = Column(String, nullable=False)
    region          = Column(String, nullable=False)
    price_etb       = Column(Float, nullable=False)
    unit            = Column(String, default="quintal")
    submitted_by    = Column(String, nullable=True)
    is_verified     = Column(Boolean, default=False)
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow)

class Crop(Base):
    __tablename__ = "crops"

    id              = Column(Integer, primary_key=True, index=True)
    name_en         = Column(String, nullable=False)
    name_am         = Column(String, nullable=True)
    name_om         = Column(String, nullable=True)
    category        = Column(String, nullable=False)
    is_active       = Column(Boolean, default=True)

class Market(Base):
    __tablename__ = "markets"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String, nullable=False)
    region          = Column(String, nullable=False)
    city            = Column(String, nullable=False)
    latitude        = Column(Float, nullable=True)
    longitude       = Column(Float, nullable=True)
    is_active       = Column(Boolean, default=True)