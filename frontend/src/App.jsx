import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import Home from "./pages/Home";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import RefundPolicy from "./pages/RefundPolicy";
import { ThemeProvider } from "./context/ThemeContext";
import { hasConsented, initConsent } from "./hooks/useCookieConsent";
import "./index.css";

export default function App() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    initConsent(); // re-apply stored consent signals to gtag on load
    if (!hasConsented()) {
      setShowBanner(true);
    }
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Header />
        {showBanner && <CookieBanner onClose={() => setShowBanner(false)} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/refund" element={<RefundPolicy />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </ThemeProvider>
  );
}
