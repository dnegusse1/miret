import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://localhost:8000"

const CROPS = [
  "Teff", "Wheat", "Maize", "Sorghum", "Barley",
  "Coffee", "Sesame", "Chickpea", "Lentil", "Haricot Bean"
]

const STATUS_COLORS = {
  optimal: { bg: "#e8f5ee", border: "#1a7a4a", text: "#1a7a4a", icon: "✅" },
  caution: { bg: "#fff8e7", border: "#f0a500", text: "#b37a00", icon: "⚠️" },
  not_ready: { bg: "#fef0f0", border: "#e74c3c", text: "#c0392b", icon: "❌" },
  unknown: { bg: "#f5f5f5", border: "#ccc", text: "#888", icon: "❓" }
}

export default function WeatherWidget({ region, lang, compact }) {
  const [weather, setWeather] = useState(null)
  const [selectedCrop, setSelectedCrop] = useState("Teff")
  const [seeding, setSeeding] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (region) fetchWeather()
  }, [region])

  useEffect(() => {
    if (region && selectedCrop) fetchSeeding()
  }, [region, selectedCrop])

  const fetchWeather = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/weather/${region}`)
      setWeather(res.data)
    } catch (err) {
      console.error("Weather error:", err)
    }
    setLoading(false)
  }

  const fetchSeeding = async () => {
    try {
      const res = await axios.get(`${API}/seeding/${region}/${selectedCrop}`)
      setSeeding(res.data.recommendation)
    } catch (err) {
      console.error("Seeding error:", err)
    }
  }

  if (!region) return null

  if (loading) return (
    <div style={{ background: "#f5f5f5", borderRadius: 12, padding: 16, textAlign: "center", color: "#888" }}>
      Loading weather...
    </div>
  )

  if (!weather) return (
    <div style={{ background: "#fef0f0", borderRadius: 12, padding: 16, textAlign: "center", color: "#c0392b" }}>
      Could not load weather data
    </div>
  )

  const colors = seeding ? STATUS_COLORS[seeding.status] : STATUS_COLORS.unknown

  return (
    <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontWeight: 600, fontSize: 15 }}>🌤 {region}</div>
        <div style={{ fontSize: 11, color: "#888", background: "#f0f0f0", padding: "2px 8px", borderRadius: 10 }}>Live</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 12 }}>
        {[
          { icon: "🌡", value: `${weather.air_temp}°C`, label: "Air" },
          { icon: "🌱", value: `${weather.soil_temp}°C`, label: "Soil" },
          { icon: "💧", value: `${weather.soil_moisture}%`, label: "Moisture" },
          { icon: "💦", value: `${weather.humidity}%`, label: "Humidity" },
          { icon: "🌧", value: `${weather.precipitation}mm`, label: "Rain" },
          { icon: "💨", value: `${weather.wind_speed}km/h`, label: "Wind" },
        ].map((stat, i) => (
          <div key={i} style={{ background: "#f9f9f9", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>{stat.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: "#888" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {!compact && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>7-day forecast</div>
          <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
            {weather.forecast.map((day, i) => (
              <div key={i} style={{ background: "#f9f9f9", borderRadius: 8, padding: "6px 8px", textAlign: "center", minWidth: 48, flex: "0 0 auto" }}>
                <div style={{ fontSize: 10, color: "#888" }}>{day.date.slice(5)}</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{day.max_temp}°</div>
                <div style={{ fontSize: 10, color: "#aaa" }}>{day.min_temp}°</div>
                <div style={{ fontSize: 10, color: "#4a90d9" }}>{day.rain}mm</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ fontSize: 11, color: "#888", marginBottom: 6 }}>Seeding check</div>
      <select
        value={selectedCrop}
        onChange={e => setSelectedCrop(e.target.value)}
        style={{ width: "100%", padding: "6px 10px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, marginBottom: 8 }}
      >
        {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {seeding && (
        <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "10px 12px" }}>
          <div style={{ fontWeight: 600, color: colors.text, marginBottom: 4, fontSize: 13 }}>
            {colors.icon} {seeding.action}
          </div>
          <div style={{ fontSize: 12, color: colors.text, lineHeight: 1.5 }}>
            {seeding.message}
          </div>
        </div>
      )}
    </div>
  )
}