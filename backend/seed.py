from database import SessionLocal, init_db
from models import Crop, Market, Price

init_db()
db = SessionLocal()

# --- CROPS ---
crops = [
    Crop(name_en="Teff", name_am="ጤፍ", name_om="Xaafile", category="grain"),
    Crop(name_en="Wheat", name_am="ስንዴ", name_om="Qamadii", category="grain"),
    Crop(name_en="Maize", name_am="በቆሎ", name_om="Boqqolloo", category="grain"),
    Crop(name_en="Sorghum", name_am="ማሽላ", name_om="Qamadii Gurraacha", category="grain"),
    Crop(name_en="Barley", name_am="ገብስ", name_om="Garbuu", category="grain"),
    Crop(name_en="Coffee", name_am="ቡና", name_om="Buna", category="coffee"),
    Crop(name_en="Sesame", name_am="ሰሊጥ", name_om="Simiiza", category="oilseed"),
    Crop(name_en="Chickpea", name_am="ሽምብራ", name_om="Qolee", category="pulse"),
    Crop(name_en="Lentil", name_am="ምስር", name_om="Masara", category="pulse"),
    Crop(name_en="Haricot Bean", name_am="ቦሎቄ", name_om="Baaqelaa", category="pulse"),
]

# --- MARKETS ---
markets = [
    Market(name="Mercato", region="Addis Ababa", city="Addis Ababa", latitude=9.0340, longitude=38.7469),
    Market(name="Shola Market", region="Addis Ababa", city="Addis Ababa", latitude=9.0200, longitude=38.7800),
    Market(name="Jimma Market", region="Oromia", city="Jimma", latitude=7.6790, longitude=36.8340),
    Market(name="Bahir Dar Market", region="Amhara", city="Bahir Dar", latitude=11.5930, longitude=37.3900),
    Market(name="Gondar Market", region="Amhara", city="Gondar", latitude=12.6030, longitude=37.4670),
    Market(name="Dire Dawa Market", region="Dire Dawa", city="Dire Dawa", latitude=9.5930, longitude=41.8660),
    Market(name="Hawassa Market", region="SNNPR", city="Hawassa", latitude=7.0500, longitude=38.4750),
    Market(name="Mekelle Market", region="Tigray", city="Mekelle", latitude=13.4967, longitude=39.4767),
]

# --- SEED PRICES ---
prices = [
    Price(crop_name="Teff", market="Mercato", region="Addis Ababa", price_etb=12000, unit="quintal", is_verified=True),
    Price(crop_name="Teff", market="Jimma Market", region="Oromia", price_etb=11500, unit="quintal", is_verified=True),
    Price(crop_name="Teff", market="Bahir Dar Market", region="Amhara", price_etb=11000, unit="quintal", is_verified=True),
    Price(crop_name="Wheat", market="Mercato", region="Addis Ababa", price_etb=8500, unit="quintal", is_verified=True),
    Price(crop_name="Wheat", market="Gondar Market", region="Amhara", price_etb=8000, unit="quintal", is_verified=True),
    Price(crop_name="Maize", market="Jimma Market", region="Oromia", price_etb=7200, unit="quintal", is_verified=True),
    Price(crop_name="Maize", market="Hawassa Market", region="SNNPR", price_etb=7000, unit="quintal", is_verified=True),
    Price(crop_name="Coffee", market="Jimma Market", region="Oromia", price_etb=95000, unit="quintal", is_verified=True),
    Price(crop_name="Coffee", market="Dire Dawa Market", region="Dire Dawa", price_etb=92000, unit="quintal", is_verified=True),
    Price(crop_name="Sorghum", market="Dire Dawa Market", region="Dire Dawa", price_etb=6500, unit="quintal", is_verified=True),
    Price(crop_name="Barley", market="Bahir Dar Market", region="Amhara", price_etb=7800, unit="quintal", is_verified=True),
    Price(crop_name="Sesame", market="Gondar Market", region="Amhara", price_etb=45000, unit="quintal", is_verified=True),
    Price(crop_name="Chickpea", market="Mercato", region="Addis Ababa", price_etb=9500, unit="quintal", is_verified=True),
    Price(crop_name="Lentil", market="Mercato", region="Addis Ababa", price_etb=11000, unit="quintal", is_verified=True),
    Price(crop_name="Haricot Bean", market="Hawassa Market", region="SNNPR", price_etb=8800, unit="quintal", is_verified=True),
]

db.add_all(crops)Í
db.add_all(markets)
db.add_all(prices)
db.commit()
db.close()

print("✅ Miret database seeded successfully!")
print(f"   {len(crops)} crops added")
print(f"   {len(markets)} markets added")
print(f"   {len(prices)} prices added")