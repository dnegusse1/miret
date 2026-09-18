import { useState, useEffect } from "react"
import axios from "axios"

const API = "https://miret-api.onrender.com"

export default function Finance({ lang }) {
  const [stocks, setStocks] = useState([])
  const [exchangeRate, setExchangeRate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinanceData()
  }, [])

  const fetchFinanceData = async () => {
    setLoading(true)
    try {
      const [stocksRes, rateRes] = await Promise.all([
        axios.get(`${API}/finance/stocks`),
        axios.get(`${API}/finance/exchange-rate`)
      ])
      setStocks(stocksRes.data.stocks)
      setExchangeRate(rateRes.data)
    } catch (err) {
      console.error("Finance error:", err)
    }
    setLoading(false)
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
            {lang === "en" ? "Ethiopian financial markets" : "የኢትዮጵያ የፋይናንስ ገበያዎች"}
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>
            {lang === "en" ? "Finance & Markets" : "ፋይናንስ እና ገበያዎች"}
          </h1>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>

        {/* Exchange Rate Card */}
        {exchangeRate && (
          <div style={{
            background: "linear-gradient(135deg, #1a7a4a, #0d5c36)",
            borderRadius: 16, padding: 24, marginBottom: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 4 }}>
                {lang === "en" ? "USD to Ethiopian Birr" : "ዶላር ወደ ብር"}
              </div>
              <div style={{ color: "#FCDD09", fontSize: 36, fontWeight: 700 }}>
                {exchangeRate.usd_etb} ETB
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 4 }}>
                1 USD = {exchangeRate.usd_etb} ETB
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 40 }}>🇺🇸 → 🇪🇹</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 8 }}>
                {lang === "en" ? "Last updated" : "የዘመነው"}: {new Date(exchangeRate.last_updated).toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}

        {/* ESX Stocks */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>
              {lang === "en" ? "Ethiopian Securities Exchange (ESX)" : "የኢትዮጵያ ሴኩሪቲዝ ገበያ"}
            </h2>
            
              href="https://ticker.et"
              target="_blank"
              rel="noreferrer"
              style={{ color: "#1a7a4a", fontSize: 13, textDecoration: "none" }}
            >
              {lang === "en" ? "View on ticker.et →" : "ticker.et ላይ ይመልከቱ →"}
            </a>
          </div>

          {loading ? (
            <p style={{ color: "#888", textAlign: "center" }}>
              {lang === "en" ? "Loading market data..." : "የገበያ መረጃ በመጫን ላይ..."}
            </p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {stocks.map(stock => (
                <div key={stock.ticker} style={{
                  background: "#fff", border: "1px solid #eee",
                  borderRadius: 12, padding: 20,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div>
                      <div style={{
                        background: "#1a7a4a", color: "#fff",
                        fontSize: 12, fontWeight: 700, padding: "3px 8px",
                        borderRadius: 6, display: "inline-block", marginBottom: 6
                      }}>
                        {stock.ticker}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{stock.company}</div>
                    </div>
                    <div style={{ fontSize: 24 }}>🏦</div>
                  </div>

                  <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 12 }}>
                    {stock.price ? (
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 22, color: "#1a7a4a" }}>
                          {stock.price.toLocaleString()} ETB
                        </div>
                        {stock.change && (
                          <div style={{ fontSize: 13, color: stock.change > 0 ? "#1a7a4a" : "#e74c3c", marginTop: 4 }}>
                            {stock.change > 0 ? "↑" : "↓"} {Math.abs(stock.change)}%
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>
                          {lang === "en" ? "Price data coming soon" : "ዋጋ ሰርቆ በቅርቡ"}
                        </div>
                        
                          href={`https://ticker.et`}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#1a7a4a", fontSize: 12, textDecoration: "none" }}
                        >
                          {lang === "en" ? "Check live price →" : "ቀጥታ ዋጋ ይፈትሹ →"}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ESX Info Banner */}
        <div style={{
          background: "#fff", border: "1px solid #eee",
          borderRadius: 12, padding: 20
        }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
            📈 {lang === "en" ? "About the Ethiopian Securities Exchange" : "ስለ ኢትዮጵያ ሴኩሪቲዝ ገበያ"}
          </div>
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
            {lang === "en"
              ? "The Ethiopian Securities Exchange (ESX) is Ethiopia's first formal stock exchange, established as a public-private partnership. Currently listed companies include Ethio Telecom (TELE), Awash Bank (AWAB), Bank of Abyssinia (BOAX), Abay Bank (ABAYB), Wegagen Bank (WGBX), and Gadaa Bank (GDAB)."
              : "የኢትዮጵያ ሴኩሪቲዝ ገበያ (ESX) የኢትዮጵያ የመጀመሪያ ይፋ የአክሲዮን ገበያ ሲሆን እንደ 官民 ሽርክና ተቋቁሟል።"
            }
          </div>
        </div>
      </div>
    </div>
  )
}