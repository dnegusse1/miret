export default function PriceCard({ price, showTrend }) {
  const trendColors = {
    up: "#1a7a4a",
    down: "#e74c3c",
    flat: "#888"
  }

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 12,
      padding: "14px 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.2s",
      cursor: "pointer"
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 16, color: "#1a1a1a" }}>{price.crop_name}</div>
        <div style={{ color: "#888", fontSize: 13, marginTop: 2 }}>
          {price.market} · {price.region}
        </div>
        <div style={{ color: "#aaa", fontSize: 11, marginTop: 2 }}>
          {new Date(price.created_at).toLocaleDateString("en-ET")}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, fontSize: 20, color: "#1a7a4a" }}>
          {price.price_etb.toLocaleString()}
        </div>
        <div style={{ color: "#aaa", fontSize: 11 }}>ETB / {price.unit}</div>
      </div>
    </div>
  )
}