import React, { useState } from "react";
import { Shield, WifiOff, CheckCircle, Zap, Lock } from "lucide-react";

const MAIZE = "#FFCB05";
const GLASS = "rgba(255,255,255,0.06)";
const GLASS_BORDER = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.42)";
const TEXT = "#FFFFFF";

const css = `
@keyframes nfcPulse {
  0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0   rgba(255,203,5,0.5); }
  50%       { transform: scale(1.05); box-shadow: 0 0 0 12px rgba(255,203,5,0);   }
}
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes scanBar {
  0%   { top: 8%;  opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  100% { top: 92%; opacity: 0; }
}
@keyframes successPop {
  0%   { transform: scale(0.7); opacity: 0; }
  60%  { transform: scale(1.1); }
  100% { transform: scale(1);   opacity: 1; }
}
@keyframes arcPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; }
}
.tap-arcs { animation: arcPulse 2.2s ease-in-out infinite; }
`;

/* ── Smartphone → Reader illustration ── */
function TapIcon() {
  return (
    <svg
      viewBox="0 0 220 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 260, height: "auto" }}
    >
      <ellipse cx="29" cy="52" rx="26" ry="44" fill="rgba(255,203,5,0.06)" />
      <rect x="6" y="8" width="46" height="88" rx="9"
        stroke="#FFCB05" strokeWidth="2" fill="rgba(0,39,76,0.55)" />
      <rect x="12" y="18" width="34" height="64" rx="5"
        fill="rgba(255,203,5,0.08)" stroke="rgba(255,203,5,0.20)" strokeWidth="1" />
      <circle cx="29" cy="13" r="2.5" fill="rgba(255,203,5,0.40)" />
      <rect x="21" y="99" width="16" height="2.5" rx="1.25" fill="rgba(255,203,5,0.45)" />
      <rect x="18" y="27" width="22" height="3"   rx="1.5"  fill="rgba(255,203,5,0.35)" />
      <rect x="18" y="34" width="16" height="2.5" rx="1.25" fill="rgba(255,203,5,0.20)" />
      <rect x="18" y="40" width="20" height="2"   rx="1"    fill="rgba(255,203,5,0.12)" />
      <g className="tap-arcs">
        <path d="M 52 39 A 13 13 0 0 1 52 65"
          stroke="rgba(255,203,5,0.92)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M 52 30 A 22 22 0 0 1 52 74"
          stroke="rgba(255,203,5,0.55)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 52 21 A 31 31 0 0 1 52 83"
          stroke="rgba(255,203,5,0.24)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <ellipse cx="154" cy="52" rx="58" ry="36" fill="rgba(74,222,128,0.05)" />
      <rect x="94" y="18" width="120" height="68" rx="11"
        stroke="rgba(255,255,255,0.20)" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
      <rect x="102" y="26" width="104" height="42" rx="8"
        fill="rgba(74,222,128,0.06)" stroke="rgba(74,222,128,0.22)" strokeWidth="1" />
      <circle cx="148" cy="47" r="7" fill="rgba(74,222,128,0.20)" />
      <circle cx="148" cy="47" r="3.5" fill="#4ADE80" />
      <path d="M 148 36 A 11 11 0 0 1 148 58"
        stroke="rgba(74,222,128,0.95)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 148 30 A 17 17 0 0 1 148 64"
        stroke="rgba(74,222,128,0.60)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 148 26 A 21 21 0 0 1 148 68"
        stroke="rgba(74,222,128,0.28)" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="104" y="72" width="100" height="7" rx="3.5"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
      <rect x="112" y="74.5" width="32" height="2" rx="1" fill="rgba(255,255,255,0.18)" />
      <rect x="150" y="74.5" width="18" height="2" rx="1" fill="rgba(74,222,128,0.50)" />
      <rect x="174" y="74.5" width="22" height="2" rx="1" fill="rgba(255,255,255,0.10)" />
    </svg>
  );
}

export function NFCTicketView() {
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (tapped) return;
    setTapped(true);
    setTimeout(() => setTapped(false), 3000);
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{css}</style>

      {/* ── HEADER — matches Map / Suite layout exactly ── */}
      <div
        style={{
          background: "rgba(0,10,25,0.45)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 18px 14px",
          flexShrink: 0,
        }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ color: MUTED, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em" }}>DIGITAL ACCESS PASS</p>
            <p style={{ color: TEXT, fontSize: "1rem", fontWeight: 600, marginTop: 1 }}>VIP Ticket</p>
          </div>
          <div
            style={{
              background: "rgba(255,203,5,0.10)",
              border: "1px solid rgba(255,203,5,0.22)",
              borderRadius: 100,
              padding: "3px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: MAIZE, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.08em" }}>DIAMOND VIP</span>
          </div>
        </div>

        {/* Offline status badge */}
        <div
          style={{
            background: "rgba(74,222,128,0.08)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(74,222,128,0.28)",
            borderRadius: 16,
            padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 0 24px rgba(74,222,128,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              width: 32, height: 32,
              borderRadius: "50%",
              background: "rgba(74,222,128,0.15)",
              border: "1px solid rgba(74,222,128,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(74,222,128,0.25)",
            }}
          >
            <Shield size={14} color="#4ADE80" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#4ADE80", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>✓ OFFLINE MODE ACTIVE</p>
            <p style={{ color: "rgba(74,222,128,0.6)", fontSize: "0.62rem", marginTop: 1 }}>Works without Wi-Fi or cellular signal</p>
          </div>
          <WifiOff size={15} color="rgba(74,222,128,0.5)" />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "16px 16px 20px", scrollbarWidth: "none" }}>

        {/* Main ticket card */}
        <div
          onClick={handleTap}
          style={{
            background: tapped ? "rgba(255,203,5,0.10)" : "rgba(255,255,255,0.06)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: tapped
              ? "1px solid rgba(255,203,5,0.40)"
              : "1px solid rgba(255,255,255,0.14)",
            borderRadius: 28,
            overflow: "hidden",
            cursor: "pointer",
            position: "relative",
            boxShadow: tapped
              ? `0 0 60px rgba(255,203,5,0.20), 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12)`
              : `0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)`,
            transition: "all 0.35s ease",
          }}
        >
          {/* Shimmer on idle */}
          {!tapped && (
            <div
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(105deg, transparent 35%, rgba(255,203,5,0.05) 50%, transparent 65%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 4s infinite",
                borderRadius: 28,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Scan line */}
          {!tapped && (
            <div
              style={{
                position: "absolute", left: 0, right: 0, height: 1.5,
                background: `linear-gradient(90deg, transparent, rgba(255,203,5,0.5), transparent)`,
                animation: "scanBar 5s ease-in-out infinite",
                pointerEvents: "none",
              }}
            />
          )}

          {/* Ticket header band */}
          <div
            style={{
              background: `linear-gradient(90deg, ${MAIZE} 0%, #F5C000 100%)`,
              padding: "14px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ color: "rgba(0,39,76,0.7)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.12em" }}>UNIVERSITY OF MICHIGAN</p>
              <p style={{ color: "#00274C", fontSize: "0.95rem", fontWeight: 700 }}>DIAMOND VIP ACCESS</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ color: "rgba(0,39,76,0.6)", fontSize: "0.58rem" }}>Season</p>
              <p style={{ color: "#00274C", fontSize: "0.88rem", fontWeight: 700 }}>2025–26</p>
            </div>
          </div>

          {/* Perforated divider */}
          <div style={{ margin: "0 18px", borderTop: "1.5px dashed rgba(255,255,255,0.10)" }} />

          {/* Ticket body */}
          <div style={{ padding: "18px 20px 14px" }}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <p style={{ color: MUTED, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.1em", marginBottom: 4 }}>SUITE</p>
                <p style={{ color: MAIZE, fontSize: "2.8rem", fontWeight: 700, lineHeight: 1 }}>402</p>
                <p style={{ color: MUTED, fontSize: "0.65rem", marginTop: 4 }}>Level 4 · North End</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: MUTED, fontSize: "0.6rem", fontWeight: 500, letterSpacing: "0.1em", marginBottom: 4 }}>GATE</p>
                <p style={{ color: TEXT, fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>VIP-7</p>
                <div
                  style={{
                    background: "rgba(74,222,128,0.12)",
                    border: "1px solid rgba(74,222,128,0.30)",
                    borderRadius: 8,
                    padding: "2px 10px",
                    marginTop: 6,
                    display: "inline-block",
                  }}
                >
                  <span style={{ color: "#4ADE80", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em" }}>FAST-TRACK</span>
                </div>
              </div>
            </div>

            {/* Tap zone */}
            <div
              style={{
                background: tapped ? "rgba(255,203,5,0.10)" : "rgba(255,255,255,0.04)",
                border: tapped ? "1.5px solid rgba(255,203,5,0.50)" : "1.5px dashed rgba(255,255,255,0.15)",
                borderRadius: 20,
                padding: "22px 16px 20px",
                display: "flex", flexDirection: "column", alignItems: "center",
                position: "relative", overflow: "hidden",
                transition: "all 0.35s ease",
              }}
            >
              {tapped ? (
                <>
                  <div
                    style={{
                      width: 72, height: 72,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${MAIZE}, #E6B800)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      animation: "successPop 0.4s ease",
                      boxShadow: `0 0 40px rgba(255,203,5,0.6), 0 8px 24px rgba(0,0,0,0.3)`,
                    }}
                  >
                    <CheckCircle size={32} color="#00274C" strokeWidth={2.5} />
                  </div>
                  <p style={{ color: MAIZE, fontSize: "0.88rem", fontWeight: 700, marginTop: 14, letterSpacing: "0.02em" }}>
                    ✓ Access Granted
                  </p>
                  <p style={{ color: MUTED, fontSize: "0.65rem", marginTop: 4, textAlign: "center" }}>
                    Welcome, Robert. Enjoy the game!
                  </p>
                </>
              ) : (
                <>
                  <TapIcon />
                  <p
                    style={{
                      color: "rgba(255,255,255,0.82)",
                      fontSize: "0.80rem",
                      fontWeight: 600,
                      marginTop: 14,
                      textAlign: "center",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Tap phone on gate reader to enter
                  </p>
                </>
              )}
            </div>

            {/* Ticket holder row */}
            <div className="flex items-center justify-between mt-4">
              {[
                { label: "HOLDER",  value: "Robert M." },
                { label: "SECTION", value: "VIP SUITE" },
                { label: "GUESTS",  value: "+3" },
              ].map(f => (
                <div key={f.label} style={{ textAlign: "center" }}>
                  <p style={{ color: MUTED, fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.1em" }}>{f.label}</p>
                  <p style={{ color: TEXT, fontSize: "0.78rem", fontWeight: 600, marginTop: 3 }}>{f.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Perforated divider */}
          <div style={{ margin: "0 18px", borderTop: "1.5px dashed rgba(255,255,255,0.08)" }} />

          {/* Barcode strip */}
          <div style={{ padding: "14px 20px 18px" }}>
            <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 8 }}>
              {Array.from({ length: 42 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i % 3 === 0 ? 3 : i % 7 === 0 ? 2 : 1,
                    height: 34,
                    background: "rgba(255,255,255,0.75)",
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>
            <p style={{ color: MUTED, fontSize: "0.58rem", textAlign: "center", letterSpacing: "0.18em", fontFamily: "monospace" }}>
              M402-VIP7-2025-0DX9F2
            </p>
          </div>
        </div>

        {/* Helper hint */}
        <p style={{ color: MUTED, fontSize: "0.62rem", textAlign: "center", marginTop: 10 }}>
          Tap the card above to simulate gate scan
        </p>

        {/* Feature cards */}
        <div className="flex gap-3 mt-4">
          {[
            { icon: <Zap size={16} color={MAIZE} />,                      label: "Battery Saver", sub: "Works at 1% battery" },
            { icon: <Lock size={16} color="#4ADE80" />,                   label: "256-bit AES",   sub: "Encrypted" },
            { icon: <WifiOff size={16} color="rgba(255,255,255,0.4)" />,  label: "No Signal",    sub: "Still works" },
          ].map(card => (
            <div
              key={card.label}
              style={{
                flex: 1,
                background: GLASS,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: 18,
                padding: "13px 12px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {card.icon}
              <p style={{ color: TEXT, fontSize: "0.7rem", fontWeight: 600, marginTop: 7 }}>{card.label}</p>
              <p style={{ color: MUTED, fontSize: "0.6rem", marginTop: 2 }}>{card.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}