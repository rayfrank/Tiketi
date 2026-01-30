import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import CrashGuard from "./components/CrashGuard";
import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import Explore from "./pages/Explore";
import Checkout from "./pages/Checkout";
import MyTickets from "./pages/MyTickets";

export default function App() {
  const location = useLocation();

  return (
    <CrashGuard>
      <div className="min-h-screen bg-gradient-to-b from-kenya-black via-kenya-black to-kenya-green/10 relative">
        {/* Kenyan glow blobs (CSS only) */}
        <div
          className="blob"
          style={{
            left: "-120px",
            top: "120px",
            background: "rgba(13,122,59,.55)",
          }}
        />
        <div
          className="blob"
          style={{
            right: "-140px",
            top: "260px",
            background: "rgba(187,10,30,.42)",
            animationDelay: "1.2s",
          }}
        />

        <TopBar />

        {/* Page transition wrapper (CSS only) */}
        <div key={location.pathname} className="page-in relative z-10">
          <Routes location={location}>
            <Route path="/" element={<Explore />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/tickets" element={<MyTickets />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <BottomNav />
      </div>
    </CrashGuard>
  );
}
