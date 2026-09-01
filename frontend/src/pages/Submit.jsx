import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://miret-api.onrender.com"

export default function Submit({ lang }) {
  const [crops, setCrops] = useState([])
  const [form, setForm] = useState({
    crop_name: "", market: "", region: "", price_etb: "", submitted_by: ""
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const regions = ["Addis Ababa","Oromia","Amhara","SNNPR","Tigray","Dire Dawa"]

  const markets = {
    "Addis Ababa": ["Mercato","Shola Market"],
    "Oromia": ["Jimma Market","Adama Market","Nekemte Market"],
    "Amhara": ["Bahir Dar Market","Gondar Market","Dessie Market"],
    "SNNPR": ["Hawassa Market","Arba Minch Market"],
    "Tigray": ["Mekelle Market","Axum Market"],
    "Dire Dawa": ["Dire Dawa Market"]
  }

  useEffect(() => {
    fetchCrops()
  }, [])

  const fetchCrops = async () => {
    try {
      const res = await axios.get(`${API}/crops`)
      setCrops(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async () => {
    if (!form.crop_name || !form.market || !form.region || !form.price_etb) {
      setError(lang === "en" ? "Please fill all required fields" : "እባክዎ ሁሉንም መስኮች ይሙሉ")
      return
    }
    setSubmitting(true)
    try {
      await axios.post(`${API}/prices`, {
        ...form,
        price_etb: parseFloat(form.price_etb)
      })
      setSuccess(true)
      setForm({ crop_name: "", market: "", region: "", price_etb: "", submitted_by: "" })
    } catch (err) {
      setError(lang === "en" ? "Submission failed. Try again." : "ማስገባት አልተሳካም።")
    }
    setSubmitting(false)
  }

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 8,
    border: "1px solid #ddd", fontSize: 14, marginBottom: 12,
    boxSizing: "border-box", background: "#fff"
  }

  const labelStyle = {
    fontSize: 13, fontWeight: 500, color: "#333", marginBottom: 4, display: "block"
  }

  return (
    <div style={{ background: "#f7f8fa", minHeight: "100vh" }}>

      {/* Page Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #eee",
        padding: "24px 24px 20px"
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>
            {lang === "en" ? "Help other farmers know the fair price" : "ሌሎች ገበሬዎች ዋጋ እንዲያውቁ ይርዱ"}
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
            {lang === "en" ? "Submit a Price" : "ዋጋ ያስገቡ"}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 32 }}>

          {/* Left — Form */}
          <div>
            {success ? (
              <div style={{
                background: "#e8f5ee", border: "1px solid #1a7a4a",
                borderRadius: 16, padding: 40, textAlign: "center"
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: 20, color: "#1a7a4a", marginBottom: 8 }}>
                  {lang === "en" ? "Price submitted!" : "ዋጋ ተልኳል!"}
                </div>
                <div style={{ color: "#2d8a5e", fontSize: 14, marginBottom: 24 }}>
                  {lang === "en"
                    ? "Thank you for helping other farmers know the fair price."
                    : "ሌሎች ገበሬዎች ተገቢውን ዋጋ እንዲያውቁ ስለረዱ አመሰግናለሁ።"
                  }
                </div>
                <button
                  onClick={() => setSuccess(false)}
                  style={{
                    background: "#1a7a4a", color: "#fff", padding: "10px 24px",
                    borderRadius: 8, border: "none", fontSize: 14,
                    fontWeight: 500, cursor: "pointer"
                  }}
                >
                  {lang === "en" ? "Submit another price" : "ሌላ ዋጋ ያስገቡ"}
                </button>
              </div>
            ) : (
              <div style={{
                background: "#fff", border: "1px solid #eee",
                borderRadius: 16, padding: 32,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
              }}>
                <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 600 }}>
                  {lang === "en" ? "Today's market price" : "የዛሬ የገበያ ዋጋ"}
                </h2>

                <label style={labelStyle}>
                  {lang === "en" ? "Crop *" : "ሰብል *"}
                </label>
                <select name="crop_name" value={form.crop_name} onChange={handleChange} style={inputStyle}>
                  <option value="">{lang === "en" ? "Select crop" : "ሰብል ይምረጡ"}</option>
                  {crops.map(c => (
                    <option key={c.id} value={c.name_en}>
                      {lang === "am" && c.name_am ? `${c.name_am} (${c.name_en})` : c.name_en}
                    </option>
                  ))}
                </select>

                <label style={labelStyle}>
                  {lang === "en" ? "Region *" : "ክልል *"}
                </label>
                <select name="region" value={form.region} onChange={handleChange} style={inputStyle}>
                  <option value="">{lang === "en" ? "Select region" : "ክልል ይምረጡ"}</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <label style={labelStyle}>
                  {lang === "en" ? "Market *" : "ገበያ *"}
                </label>
                <select name="market" value={form.market} onChange={handleChange} style={inputStyle}>
                  <option value="">{lang === "en" ? "Select market" : "ገበያ ይምረጡ"}</option>
                  {form.region && markets[form.region]
                    ? markets[form.region].map(m => <option key={m} value={m}>{m}</option>)
                    : <option disabled>{lang === "en" ? "Select region first" : "መጀመሪያ ክልል ይምረጡ"}</option>
                  }
                </select>

                <label style={labelStyle}>
                  {lang === "en" ? "Price in ETB per quintal *" : "ዋጋ በብር በኩንታል *"}
                </label>
                <input
                  type="number"
                  name="price_etb"
                  value={form.price_etb}
                  onChange={handleChange}
                  placeholder="e.g. 12000"
                  style={inputStyle}
                />

                <label style={labelStyle}>
                  {lang === "en" ? "Your phone number (optional)" : "ስልክ ቁጥርዎ (አማራጭ)"}
                </label>
                <input
                  type="tel"
                  name="submitted_by"
                  value={form.submitted_by}
                  onChange={handleChange}
                  placeholder="09xxxxxxxx"
                  style={inputStyle}
                />

                {error && (
                  <div style={{
                    background: "#fef0f0", border: "1px solid #e74c3c",
                    borderRadius: 8, padding: "10px 14px", marginBottom: 12,
                    color: "#c0392b", fontSize: 13
                  }}>
                    {error}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    width: "100%", padding: "12px",
                    background: submitting ? "#888" : "#1a7a4a",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontSize: 15, fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer"
                  }}
                >
                  {submitting
                    ? (lang === "en" ? "Submitting..." : "በመላክ ላይ...")
                    : (lang === "en" ? "Submit price" : "ዋጋ አስገባ")
                  }
                </button>
              </div>
            )}
          </div>

          {/* Right — Why it matters */}
          <div>
            <div style={{
              background: "#fff", border: "1px solid #eee",
              borderRadius: 16, padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              marginBottom: 16
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
                {lang === "en" ? "Why submit a price?" : "ለምን ዋጋ ማስገባት?"}
              </h3>

              {[
                {
                  icon: "🤝",
                  title: lang === "en" ? "Help other farmers" : "ሌሎችን ይርዱ",
                  desc: lang === "en"
                    ? "Your price helps farmers across Ethiopia know the fair market rate"
                    : "ዋጋዎ በኢትዮጵያ ያሉ ገበሬዎች ተገቢውን ዋጋ እንዲያውቁ ይረዳቸዋል"
                },
                {
                  icon: "⚖️",
                  title: lang === "en" ? "Fight price exploitation" : "የዋጋ 착취ን ይዋጉ",
                  desc: lang === "en"
                    ? "Transparent prices reduce information asymmetry that middlemen exploit"
                    : "ግልጽ ዋጋዎች ደላሎች የሚጠቀሙበትን የመረጃ ልዩነት ይቀንሳሉ"
                },
                {
                  icon: "📊",
                  title: lang === "en" ? "Build better data" : "የተሻለ መረጃ ይገንቡ",
                  desc: lang === "en"
                    ? "More submissions means more accurate prices for everyone"
                    : "ተጨማሪ ማስገቢያዎች ለሁሉም የተሻለ ዋጋ ማለት ነው"
                },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex", gap: 12, marginBottom: 16,
                  paddingBottom: 16, borderBottom: i < 2 ? "1px solid #f0f0f0" : "none"
                }}>
                  <div style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ethiopian flag accent card */}
            <div style={{
              background: "linear-gradient(135deg, #1a7a4a, #0d5c36)",
              borderRadius: 16, padding: 24, color: "#fff"
            }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🇪🇹</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, color: "#FCDD09" }}>
                {lang === "en" ? "Built for Ethiopian farmers" : "ለኢትዮጵያ ገበሬዎች የተሰራ"}
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                {lang === "en"
                  ? "Miret is a community platform. Every price submission makes it more powerful for everyone."
                  : "ምርት የማህበረሰብ መድረክ ነው። እያንዳንዱ የዋጋ ማስገቢያ ለሁሉም የበለጠ ጠንካራ ያደርጋቸዋል።"
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}