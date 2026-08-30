import { Link, useLocation } from "react-router-dom"

export default function Navbar({ lang, setLang }) {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Home", labelAm: "መነሻ" },
    { path: "/prices", label: "Prices", labelAm: "ዋጋዎች" },
    { path: "/weather", label: "Weather", labelAm: "አየር ሁኔታ" },
    { path: "/markets", label: "Markets", labelAm: "ገበያዎች" },
    { path: "/submit", label: "Submit Price", labelAm: "ዋጋ አስገባ" },
  ]

  return (
    <nav style={{
      background: "#1a7a4a",
      padding: "0 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 56,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>ምርት</span>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>Miret</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 500,
              color: location.pathname === item.path ? "#1a7a4a" : "rgba(255,255,255,0.85)",
              background: location.pathname === item.path ? "#fff" : "transparent",
              transition: "all 0.2s"
            }}
          >
            {lang === "am" ? item.labelAm : item.label}
          </Link>
        ))}
      </div>

      {/* Language + Flag */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 18 }}>🇪🇹</span>
        <button
          onClick={() => setLang(lang === "en" ? "am" : "en")}
          style={{
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: 16,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 500
          }}
        >
          {lang === "en" ? "አማርኛ" : "English"}
        </button>
      </div>
    </nav>
  )
}