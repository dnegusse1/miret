import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Prices from "./pages/Prices"
import Weather from "./pages/Weather"
import Markets from "./pages/Markets"
import Submit from "./pages/Submit"

export default function App() {
  const [lang, setLang] = useState("en")

  return (
    <BrowserRouter>
      <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", minHeight: "100vh" }}>
        <Navbar lang={lang} setLang={setLang} />
        <Routes>
          <Route path="/" element={<Home lang={lang} />} />
          <Route path="/prices" element={<Prices lang={lang} />} />
          <Route path="/weather" element={<Weather lang={lang} />} />
          <Route path="/markets" element={<Markets lang={lang} />} />
          <Route path="/submit" element={<Submit lang={lang} />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}