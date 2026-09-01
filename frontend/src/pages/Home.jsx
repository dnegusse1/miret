import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import WeatherWidget from "../components/WeatherWidget"
import PriceCard from "../components/PriceCard"

const API = "https://miret-api.onrender.com"

export default function Home({ lang }) {
  const [prices, setPrices] = useState([])
  const [selectedRegion, setSelectedRegion] = useState("Addis Ababa")
  const [loading, setLoading] = useState(true)

  const regions = ["Addis Ababa","Oromia","Amhara","SNNPR","Tigray","Dire Dawa"]

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/prices`)
      setPrices(res.data.slice(0, 6))
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh" }}>

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #1a7a4a 0%, #0d5c36 50%, #1a3a2a 100%)",
        padding: "60px 24px 48px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Ethiopian flag stripe accents */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(to right, #1a7a4a 33%, #FCDD09 33%, #FCDD09 66%, #E8112D 66%)" }} />

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🌾</div>
          <h1 style={{ color: "#fff", fontSize: 38, fontWeight: 700, margin: "0 0 12px", letterSpacing: -1 }}>
            {lang === "en" ? "Ethiopia's Agricultural Price Platform" : "የኢትዮጵያ የግብርና ዋጋ መረጃ"}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, margin: "0 0 32px", lineHeight: 1.6 }}>
            {lang === "en"
              ? "Real-time crop prices from markets across Ethiopia. Know your price before you sell."
              : "ከኢትዮጵያ ገበያዎች የሰብል ዋጋ በቀጥታ። ከመሸጥዎ በፊት ዋጋ ይወቁ።"
            }
          </p>

          {/* Stats Bar */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 32 }}>
            {[
              { value: "10+", label: lang === "en" ? "Crops tracked" : "የሚከታተሉ ሰብሎች" },
              { value: "8+", label: lang === "en" ? "Markets" : "ገበያዎች" },
              { value: "6", label: lang === "en" ? "Regions" : "ክልሎች" },
              { value: "Live", label: lang === "en" ? "Price updates" : "ዋጋ ዝማኔ" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#FCDD09" }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Link to="/prices" style={{
              background: "#FCDD09", color: "#1a1a1a", padding: "12px 28px",
              borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 15
            }}>
              {lang === "en" ? "View Prices" : "ዋጋ ይመልከቱ"}
            </Link>
            <Link to="/submit" style={{
              background: "rgba(255,255,255,0.15)", color: "#fff", padding: "12px 28px",
              borderRadius: 8, textDecoration: "none", fontWeight: 600, fontSize: 15,
              border: "1px solid rgba(255,255,255,0.3)"
            }}>
              {lang === "en" ? "Submit a Price" : "ዋጋ ያስገቡ"}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

          {/* Left — Latest Prices */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {lang === "en" ? "Latest Prices" : "የቅርብ ጊዜ ዋጋዎች"}
              </h2>
              <Link to="/prices" style={{ color: "#1a7a4a", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
                {lang === "en" ? "View all →" : "ሁሉንም ይመልከቱ →"}
              </Link>
            </div>

            {loading ? (
              <p style={{ color: "#888", textAlign: "center" }}>Loading...</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {prices.map(price => (
                  <PriceCard key={price.id} price={price} />
                ))}
              </div>
            )}
          </div>

          {/* Right — Weather Widget */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
                {lang === "en" ? "Seeding Conditions" : "የዘር ሁኔታ"}
              </h2>
              <Link to="/weather" style={{ color: "#1a7a4a", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
                {lang === "en" ? "All regions →" : "ሁሉም ክልሎች →"}
              </Link>
            </div>

            {/* Region selector */}
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, marginBottom: 12 }}
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <WeatherWidget region={selectedRegion} lang={lang} compact={false} />
          </div>
        </div>

        {/* Bottom Banner */}
        <div style={{
          marginTop: 40, background: "linear-gradient(135deg, #1a7a4a, #0d5c36)",
          borderRadius: 16, padding: "32px 40px",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ color: "#FCDD09", fontWeight: 700, fontSize: 20, marginBottom: 6 }}>
              {lang === "en" ? "Know the fair price before you sell" : "ከመሸጥዎ በፊት ተገቢውን ዋጋ ይወቁ"}
            </div>
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
              {lang === "en"
                ? "Submit today's price from your market and help other farmers"
                : "የዛሬውን የገበያ ዋጋ ያስገቡ እና ሌሎች ገበሬዎችን ይርዱ"
              }
            </div>
          </div>
          <Link to="/submit" style={{
            background: "#FCDD09", color: "#1a1a1a", padding: "12px 24px",
            borderRadius: 8, textDecoration: "none", fontWeight: 600,
            fontSize: 14, whiteSpace: "nowrap"
          }}>
            {lang === "en" ? "Submit Price →" : "ዋጋ ያስገቡ →"}
          </Link>
        </div>
      </div>
    </div>
  )
}