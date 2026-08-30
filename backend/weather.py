import httpx
from typing import Optional

# Ethiopian market coordinates
MARKET_COORDINATES = {
    "Addis Ababa": {"lat": 9.03, "lon": 38.74},
    "Oromia": {"lat": 7.67, "lon": 36.83},
    "Amhara": {"lat": 11.59, "lon": 37.39},
    "SNNPR": {"lat": 7.05, "lon": 38.47},
    "Tigray": {"lat": 13.49, "lon": 39.47},
    "Dire Dawa": {"lat": 9.59, "lon": 41.86}
}

# Optimal seeding conditions per crop
CROP_CONDITIONS = {
    "Teff": {
        "soil_temp_min": 15, "soil_temp_max": 25,
        "soil_moisture_min": 40, "soil_moisture_max": 60,
        "name_am": "ጤፍ"
    },
    "Wheat": {
        "soil_temp_min": 12, "soil_temp_max": 22,
        "soil_moisture_min": 45, "soil_moisture_max": 65,
        "name_am": "ስንዴ"
    },
    "Maize": {
        "soil_temp_min": 18, "soil_temp_max": 30,
        "soil_moisture_min": 50, "soil_moisture_max": 70,
        "name_am": "በቆሎ"
    },
    "Sorghum": {
        "soil_temp_min": 20, "soil_temp_max": 35,
        "soil_moisture_min": 35, "soil_moisture_max": 55,
        "name_am": "ማሽላ"
    },
    "Barley": {
        "soil_temp_min": 10, "soil_temp_max": 20,
        "soil_moisture_min": 45, "soil_moisture_max": 65,
        "name_am": "ገብስ"
    },
    "Coffee": {
        "soil_temp_min": 15, "soil_temp_max": 24,
        "soil_moisture_min": 60, "soil_moisture_max": 80,
        "name_am": "ቡና"
    },
    "Sesame": {
        "soil_temp_min": 25, "soil_temp_max": 35,
        "soil_moisture_min": 30, "soil_moisture_max": 50,
        "name_am": "ሰሊጥ"
    },
    "Chickpea": {
        "soil_temp_min": 15, "soil_temp_max": 25,
        "soil_moisture_min": 40, "soil_moisture_max": 60,
        "name_am": "ሽምብራ"
    },

    "Lentil": {
        "soil_temp_min": 18, "soil_temp_max": 25,
        "soil_moisture_min": 40, "soil_moisture_max": 60,
        "name_am": "ምስር"
    },
    "Haricot Bean": {
        "soil_temp_min": 18, "soil_temp_max": 28,
        "soil_moisture_min": 45, "soil_moisture_max": 65,
        "name_am": "ቦሎቄ"
    }
}

async def get_weather_data(region: str) -> Optional[dict]:
    coords = MARKET_COORDINATES.get(region)
    if not coords:
        return None

    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": coords["lat"],
        "longitude": coords["lon"],
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "precipitation",
            "wind_speed_10m",
            "soil_temperature_0cm",
            "soil_moisture_0_to_1cm"
        ],
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_sum"
        ],
        "timezone": "Africa/Addis_Ababa",
        "forecast_days": 7
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        data = response.json()

    current = data.get("current", {})
    daily = data.get("daily", {})

    return {
        "region": region,
        "air_temp": round(current.get("temperature_2m", 0), 1),
        "humidity": round(current.get("relative_humidity_2m", 0), 1),
        "precipitation": round(current.get("precipitation", 0), 1),
        "wind_speed": round(current.get("wind_speed_10m", 0), 1),
        "soil_temp": round(current.get("soil_temperature_0cm", 0), 1),
        "soil_moisture": round(current.get("soil_moisture_0_to_1cm", 0) * 100, 1),
        "forecast": [
            {
                "date": daily["time"][i],
                "max_temp": daily["temperature_2m_max"][i],
                "min_temp": daily["temperature_2m_min"][i],
                "rain": daily["precipitation_sum"][i]
            }
            for i in range(min(7, len(daily.get("time", []))))
        ]
    }

def get_seeding_recommendation(crop: str, weather: dict) -> dict:
    conditions = CROP_CONDITIONS.get(crop)
    if not conditions:
        return {"status": "unknown", "message": "Crop data not available"}

    soil_temp = weather["soil_temp"]
    soil_moisture = weather["soil_moisture"]

    issues = []
    warnings = []

    # Check soil temperature
    if soil_temp < conditions["soil_temp_min"]:
        diff = conditions["soil_temp_min"] - soil_temp
        issues.append(
            f"Soil too cold ({soil_temp}C). "
            f"Optimal: {conditions['soil_temp_min']}-{conditions['soil_temp_max']}C. "
            f"Needs {diff:.1f}C more warmth."
        )
    elif soil_temp > conditions["soil_temp_max"]:
        diff = soil_temp - conditions["soil_temp_max"]
        issues.append(
            f"Soil too hot ({soil_temp}C). "
            f"Optimal: {conditions['soil_temp_min']}-{conditions['soil_temp_max']}C. "
            f"Needs to cool by {diff:.1f}C."
        )

    # Check soil moisture
    if soil_moisture < conditions["soil_moisture_min"]:
        issues.append(
            f"Soil too dry ({soil_moisture:.1f}%). "
            f"Optimal: {conditions['soil_moisture_min']}-{conditions['soil_moisture_max']}%. "
            f"Consider irrigation."
        )
    elif soil_moisture > conditions["soil_moisture_max"]:
        warnings.append(
            f"Soil moisture high ({soil_moisture:.1f}%). "
            f"Wait for drainage before seeding."
        )

    if issues:
        return {
            "status": "not_ready",
            "color": "red",
            "message": " | ".join(issues),
            "action": "Wait before seeding"
        }
    elif warnings:
        return {
            "status": "caution",
            "color": "yellow",
            "message": " | ".join(warnings),
            "action": "Proceed with caution"
        }
    else:
        return {
            "status": "optimal",
            "color": "green",
            "message": f"Conditions optimal for {crop}. Soil temp {soil_temp}C, moisture {soil_moisture:.1f}%.",
            "action": "Good time to seed"
        }


