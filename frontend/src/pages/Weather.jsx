import { useState } from "react"
import WeatherWidget from "../components/WeatherWidget"

export default function Weather({ lang }) {
  const [selectedRegion, setSelectedRegion] = useState("Addis Ababa")

  const regions = [
    { name: "Addis Ababa", emoji: "🏙" },
    { name: "Oromia", emoji: "🌿" },
    { name: "Amhara", emoji: "🏔" },
    { name: "SNNPR", emoji: "🌱" },
    { name: "Tigray", emoji: "⛰" },
    { name: "Dire Dawa", emoji: "☀️" }
  ]

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh" }}>

      {/* Page Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #eee",
        padding: "24px 24px 20px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            {lang === "en" ? "Live weather & seeding intelligence" : "ቀጥታ አየር ሁኔታ እና የዘር ምክር"}
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
            {lang === "en" ? "Weather & Seeding Conditions" : "አየር ሁኔታ እና የዘር ሁኔታ"}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>

        {/* Region Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {regions.map(r => (
            <button
              key={r.name}
              onClick={() => setSelectedRegion(r.name)}
              style={{
                padding: "8px 16px", borderRadius: 20,
                border: selectedRegion === r.name ? "none" : "1px solid #ddd",
                background: selectedRegion === r.name ? "#1a7a4a" : "#fff",
                color: selectedRegion === r.name ? "#fff" : "#333",
                fontSize: 13, fontWeight: 500, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6
              }}
            >
              {r.emoji} {r.name}
            </button>
          ))}
        </div>

        {/* Two column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Left — Full Weather Widget */}
          <WeatherWidget region={selectedRegion} lang={lang} compact={false} />

          {/* Right — Seeding Guide */}
          <div>
            <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
                🌱 {lang === "en" ? "Crop Seeding Guide" : "የሰብል መዝሪያ መመሪያ"}
              </h3>

              {[
                { crop: "Teff", temp: "15-25°C", moisture: "40-60%", emoji: "🌾" },
                { crop: "Wheat", temp: "12-22°C", moisture: "45-65%", emoji: "🌿" },
                { crop: "Maize", temp: "18-30°C", moisture: "50-70%", emoji: "🌽" },
                { crop: "Coffee", temp: "15-24°C", moisture: "60-80%", emoji: "☕" },
                { crop: "Sorghum", temp: "20-35°C", moisture: "35-55%", emoji: "🌾" },
                { crop: "Barley", temp: "10-20°C", moisture: "45-65%", emoji: "🌿" },
                { crop: "Sesame", temp: "25-35°C", moisture: "30-50%", emoji: "🌻" },
                { crop: "Chickpea", temp: "15-25°C", moisture: "40-60%", emoji: "🫘" },
                { crop: "Lentil", temp: "18-25°C", moisture: "40-60%", emoji: "🫘" },
                { crop: "Haricot Bean", temp: "18-28°C", moisture: "45-65%", emoji: "🫘" },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", padding: "10px 0",
                  borderBottom: i < 9 ? "1px solid #f0f0f0" : "none"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{item.emoji}</span>
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{item.crop}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "#1a7a4a", fontWeight: 500 }}>🌡 {item.temp}</div>
                    <div style={{ fontSize: 12, color: "#4a90d9" }}>💧 {item.moisture}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* EMI Note */}
            <div style={{ background: "#fff8e7", border: "1px solid #f0c040", borderRadius: 12, padding: 16, marginTop: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#b37a00", marginBottom: 4 }}>
                📡 {lang === "en" ? "About our weather data" : "ስለ አየር ሁኔታ መረጃችን"}
              </div>
              <div style={{ fontSize: 12, color: "#7a5200", lineHeight: 1.6 }}>
                {lang === "en"
                  ? "Current data is sourced from Open-Meteo. We are working to integrate official Ethiopian Meteorological Institute (EMI) data as their API becomes available in 2026-2027."
                  : "አሁን ያለው መረጃ ከ Open-Meteo ነው። የኢትዮጵያ ሜትሮሎጂ ኢንስቲትዩት (EMI) API ሲገኝ ለማዋሃድ እየሰራን ነው።"
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}