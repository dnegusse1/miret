import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://localhost:8000"

export default function Markets({ lang }) {
  const [markets, setMarkets] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState("")

  const regions = [
    "Addis Ababa",
    "Oromia",
    "Amhara",
    "SNNPR",
    "Tigray",
    "Dire Dawa"
  ]

  useEffect(() => {
    fetchMarkets()
  }, [])

  const fetchMarkets = async () => {
    setLoading(true)

    try {
      const res = await axios.get(`${API}/markets`)
      setMarkets(res.data)
    } catch (err) {
      console.error(err)
    }

    setLoading(false)
  }

  const filtered = selectedRegion
    ? markets.filter((m) => m.region === selectedRegion)
    : markets

  const regionEmojis = {
    "Addis Ababa": "🏙",
    "Oromia": "🌿",
    "Amhara": "🏔",
    "SNNPR": "🌱",
    "Tigray": "⛰",
    "Dire Dawa": "☀️"
  }

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh" }}>

      {/* Page Header */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #eee",
          padding: "24px 24px 20px"
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            {lang === "en"
              ? "Agricultural markets across Ethiopia"
              : "በኢትዮጵያ የሚገኙ ገበያዎች"}
          </div>

          <h1
            style={{
              margin: "0 0 16px",
              fontSize: 26,
              fontWeight: 700
            }}
          >
            {lang === "en" ? "Markets" : "ገበያዎች"}
          </h1>

          {/* Region filter tabs */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap"
            }}
          >
            <button
              onClick={() => setSelectedRegion("")}
              style={{
                padding: "6px 14px",
                borderRadius: 16,
                border: !selectedRegion ? "none" : "1px solid #ddd",
                background: !selectedRegion ? "#1a7a4a" : "#fff",
                color: !selectedRegion ? "#fff" : "#333",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              {lang === "en" ? "All regions" : "ሁሉም"}
            </button>

            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 16,
                  border:
                    selectedRegion === r
                      ? "none"
                      : "1px solid #ddd",
                  background:
                    selectedRegion === r
                      ? "#1a7a4a"
                      : "#fff",
                  color:
                    selectedRegion === r
                      ? "#fff"
                      : "#333",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                {regionEmojis[r]} {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "24px"
        }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#888"
            }}
          >
            {lang === "en"
              ? "Loading markets..."
              : "ገበያዎች በመጫን ላይ..."}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16
            }}
          >
            {filtered.map((market) => (
              <div
                key={market.id}
                style={{
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 20,
                  boxShadow:
                    "0 1px 4px rgba(0,0,0,0.06)",
                  transition: "box-shadow 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.boxShadow =
                    "0 1px 4px rgba(0,0,0,0.06)")
                }
              >
                {/* Market header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "#e8f5ee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20
                    }}
                  >
                    {regionEmojis[market.region] || "🏪"}
                  </div>

                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 15
                      }}
                    >
                      {market.name}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: "#888"
                      }}
                    >
                      {market.city}
                    </div>
                  </div>
                </div>

                {/* Region badge */}
                <div
                  style={{
                    display: "inline-block",
                    background: "#f0f7f3",
                    color: "#1a7a4a",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "3px 10px",
                    borderRadius: 10,
                    marginBottom: 12
                  }}
                >
                  {market.region}
                </div>

                {/* Coordinates */}
                {market.latitude && market.longitude && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#aaa",
                      display: "flex",
                      alignItems: "center",
                      gap: 4
                    }}
                  >
                    <span>📍</span>

                    <span>
                      {market.latitude.toFixed(2)}°N,{" "}
                      {market.longitude.toFixed(2)}°E
                    </span>
                  </div>
                )}

                {/* Google Maps link */}
                {market.latitude && market.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${market.latitude},${market.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "block",
                      marginTop: 12,
                      textAlign: "center",
                      background: "#1a7a4a",
                      color: "#fff",
                      padding: "8px",
                      borderRadius: 8,
                      textDecoration: "none",
                      fontSize: 12,
                      fontWeight: 500
                    }}
                  >
                    {lang === "en"
                      ? "View on Google Maps →"
                      : "በካርታ ላይ ይመልከቱ →"}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add Market CTA */}
        <div
          style={{
            marginTop: 32,
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 24,
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: 20,
              marginBottom: 8
            }}
          >
            🏪
          </div>

          <div
            style={{
              fontWeight: 600,
              fontSize: 15,
              marginBottom: 6
            }}
          >
            {lang === "en"
              ? "Is your market missing?"
              : "ገበያዎ አልተገኘም?"}
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#888",
              marginBottom: 16
            }}
          >
            {lang === "en"
              ? "Contact us to add your local market to Miret"
              : "ገበያዎን ወደ ምርት ለማከል ያግኙን"}
          </div>

          {/* Contact link */}
          <a
            href="mailto:info@miret.et"
            style={{
              background: "#1a7a4a",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: 500
            }}
          >
            {lang === "en" ? "Contact us" : "ያግኙን"}
          </a>
        </div>
      </div>
    </div>
  )
}
