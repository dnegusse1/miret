import { useState, useEffect } from "react"
import axios from "axios"
import PriceCard from "../components/PriceCard"

const API = "http://localhost:8000"

export default function Prices({ lang }) {
  const [prices, setPrices] = useState([])
  const [crops, setCrops] = useState([])
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedCrop, setSelectedCrop] = useState("")
  const [loading, setLoading] = useState(true)

  const regions = ["Addis Ababa","Oromia","Amhara","SNNPR","Tigray","Dire Dawa"]

  useEffect(() => {
    fetchPrices()
    fetchCrops()
  }, [selectedRegion, selectedCrop])

  const fetchPrices = async () => {
    setLoading(true)
    try {
      const params = {}
      if (selectedRegion) params.region = selectedRegion
      if (selectedCrop) params.crop = selectedCrop
      const res = await axios.get(`${API}/prices`, { params })
      setPrices(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const fetchCrops = async () => {
    try {
      const res = await axios.get(`${API}/crops`)
      setCrops(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh" }}>

      {/* Page Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #eee",
        padding: "24px 24px 0"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ marginBottom: 4 }}>
            <span style={{ fontSize: 12, color: "#888" }}>
              {lang === "en" ? "Live market data" : "ቀጥታ የገበያ መረጃ"}
            </span>
          </div>
          <h1 style={{ margin: "0 0 20px", fontSize: 26, fontWeight: 700 }}>
            {lang === "en" ? "Market Prices" : "የገበያ ዋጋዎች"}
          </h1>

          {/* Filters */}
          <div style={{ display: "flex", gap: 12, paddingBottom: 16 }}>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, background: "#fff", cursor: "pointer" }}
            >
              <option value="">{lang === "en" ? "All regions" : "ሁሉም ክልሎች"}</option>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <select
              value={selectedCrop}
              onChange={e => setSelectedCrop(e.target.value)}
              style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, background: "#fff", cursor: "pointer" }}
            >
              <option value="">{lang === "en" ? "All crops" : "ሁሉም እህሎች"}</option>
              {crops.map(c => (
                <option key={c.id} value={c.name_en}>
                  {lang === "am" && c.name_am ? c.name_am : c.name_en}
                </option>
              ))}
            </select>

            {(selectedRegion || selectedCrop) && (
              <button
                onClick={() => { setSelectedRegion(""); setSelectedCrop("") }}
                style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, background: "#fff", cursor: "pointer", color: "#e74c3c" }}
              >
                {lang === "en" ? "Clear filters" : "አጽዳ"}
              </button>
            )}

            <div style={{ marginLeft: "auto", fontSize: 13, color: "#888", alignSelf: "center" }}>
              {prices.length} {lang === "en" ? "prices found" : "ዋጋዎች ተገኝተዋል"}
            </div>
          </div>
        </div>
      </div>

      {/* Price Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
            {lang === "en" ? "Loading prices..." : "ዋጋ በመጫን ላይ..."}
          </div>
        ) : prices.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
            {lang === "en" ? "No prices found" : "ዋጋ አልተገኘም"}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
            {prices.map(price => (
              <PriceCard key={price.id} price={price} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}