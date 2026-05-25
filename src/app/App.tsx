import React, { useState, useEffect } from "react";
import { TimelineView } from "./components/TimelineView";
import { NFCTicketView } from "./components/NFCTicketView";
import { MapView } from "./components/MapView";
import { SuiteCommandView } from "./components/SuiteCommandView";

const MAIZE = "#FFCB05";
const MUTED_NAV = "rgba(255,255,255,0.82)";

const navCss = `
@keyframes navIconPop {
  0%   { transform: scale(0.80); opacity: 0.6; }
  55%  { transform: scale(1.18); opacity: 1;   }
  100% { transform: scale(1);    opacity: 1;   }
}
@keyframes navPillIn {
  from { transform: translateX(-50%) scaleX(0.2); opacity: 0; }
  to   { transform: translateX(-50%) scaleX(1);   opacity: 1; }
}
@keyframes navTabPress {
  0%   { transform: scale(1);    }
  45%  { transform: scale(0.90); }
  100% { transform: scale(1);    }
}
`;

type Tab = "timeline" | "ticket" | "map" | "suite";

// ── Status Bar ──────────────────────────────────────────────────────────────
function SignalBars() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <rect x="0"  y="9" width="3" height="3"  rx="0.8" fill="rgba(255,255,255,0.85)" />
      <rect x="4"  y="6" width="3" height="6"  rx="0.8" fill="rgba(255,255,255,0.85)" />
      <rect x="8"  y="3" width="3" height="9"  rx="0.8" fill="rgba(255,255,255,0.85)" />
      <rect x="12" y="0" width="3" height="12" rx="0.8" fill="rgba(255,255,255,0.85)" />
    </svg>
  );
}

function WifiWaves() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
      <circle cx="8" cy="10.5" r="1.2" fill="rgba(255,255,255,0.85)"/>
      <path d="M4.5 7.2 A5 5 0 0 1 11.5 7.2" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <path d="M1.5 4.2 A9 9 0 0 1 14.5 4.2" stroke="rgba(255,255,255,0.85)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="20" height="10" viewBox="0 0 25 13" fill="none">
      <rect x="0.75" y="0.75" width="21" height="11.5" rx="2.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2"/>
      <rect x="22.5" y="4" width="2" height="5" rx="1" fill="rgba(255,255,255,0.60)"/>
      <rect x="2.5" y="2.5" width="15" height="8" rx="1.5" fill="rgba(255,255,255,0.85)"/>
    </svg>
  );
}

function StatusBar() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  );

  useEffect(() => {
    const update = () =>
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    const t = setInterval(update, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        left: 0,
        right: 0,
        height: 28,
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: 22,
        paddingRight: 16,
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          color: "rgba(255,255,255,0.88)",
          fontSize: "0.86rem",
          fontWeight: 600,
          letterSpacing: "0.01em",
          fontVariantNumeric: "tabular-nums",
          fontFamily: "Inter, sans-serif",
          lineHeight: 1,
        }}
      >
        {time}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <SignalBars />
        <WifiWaves />
        <BatteryIcon />
      </div>
    </div>
  );
}

// Custom SVG icons — pure thin-line stroke style, no fills
const TimelineIcon = ({ active }: { active: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Vertical spine */}
    <line x1="5.5" y1="3" x2="5.5" y2="21" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.4" opacity="0.4" />
    {/* Node circles — outline only */}
    <circle cx="5.5" cy="6"  r="2.2" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" />
    <circle cx="5.5" cy="12" r="2.2" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" opacity={active ? 0.75 : 0.6} />
    <circle cx="5.5" cy="18" r="2.2" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" opacity={active ? 0.45 : 0.35} />
    {/* Content lines */}
    <line x1="10.5" y1="6"  x2="21" y2="6"  stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" />
    <line x1="10.5" y1="12" x2="19" y2="12" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" opacity={active ? 0.75 : 0.5} />
    <line x1="10.5" y1="18" x2="17" y2="18" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" opacity={active ? 0.45 : 0.3} />
  </svg>
);

const TicketIcon = ({ active }: { active: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Ticket outline */}
    <rect x="2" y="6.5" width="20" height="11" rx="2.5" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" />
    {/* Tear-off perforation */}
    <line x1="9.5" y1="6.5" x2="9.5" y2="17.5" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.2" strokeDasharray="1.8 1.4" />
    {/* NFC ring — outline only */}
    <circle cx="15.5" cy="12" r="1.8" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.4" />
    <circle cx="15.5" cy="12" r="3.4" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1" opacity="0.45" />
  </svg>
);

const MapIcon = ({ active }: { active: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* Pin drop */}
    <path
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
      stroke={active ? MAIZE : MUTED_NAV}
      strokeWidth="1.5"
    />
    {/* Inner circle — outline only */}
    <circle cx="12" cy="9" r="2.3" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.4" />
  </svg>
);

const SuiteIcon = ({ active }: { active: boolean }) => (
  <svg width="21" height="21" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3"    y="3"    width="7.5" height="7.5" rx="2" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" />
    <rect x="13.5" y="3"    width="7.5" height="7.5" rx="2" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" opacity={active ? 0.7 : 0.5} />
    <rect x="3"    y="13.5" width="7.5" height="7.5" rx="2" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" opacity={active ? 0.7 : 0.5} />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" stroke={active ? MAIZE : MUTED_NAV} strokeWidth="1.5" opacity={active ? 0.38 : 0.28} />
  </svg>
);

const navItems = [
  { id: "timeline" as Tab, label: "Timeline", icon: (a: boolean) => <TimelineIcon active={a} /> },
  { id: "ticket" as Tab, label: "Ticket", icon: (a: boolean) => <TicketIcon active={a} /> },
  { id: "map" as Tab, label: "Map", icon: (a: boolean) => <MapIcon active={a} /> },
  { id: "suite" as Tab, label: "Suite", icon: (a: boolean) => <SuiteIcon active={a} /> },
];

const personaHints = [
  { name: "Robert", focus: "Battery & Connectivity", tab: "ticket" as Tab, color: "#60A5FA" },
  { name: "Sarah", focus: "Family & Wayfinding", tab: "map" as Tab, color: "#F9A8D4" },
  { name: "Michael", focus: "Efficiency", tab: "suite" as Tab, color: "#6EE7B7" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("timeline");
  const [justActivated, setJustActivated] = useState<Tab | null>(null);
  const [navPressing, setNavPressing] = useState<Tab | null>(null);

  // Embed mode: when iframed into the case study (?embed=1), strip the page
  // chrome (background, badge, persona pills) so only the phone shows.
  const EMBED =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("embed");

  const handleTabChange = (id: Tab) => {
    if (id === activeTab) return;
    setActiveTab(id);
    setJustActivated(id);
    setTimeout(() => setJustActivated(null), 420);
  };

  const renderView = () => {
    switch (activeTab) {
      case "timeline": return <TimelineView onNavigateToMap={() => setActiveTab("map")} />;
      case "ticket":  return <NFCTicketView />;
      case "map":     return <MapView />;
      case "suite":   return <SuiteCommandView />;
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        background: EMBED
          ? "transparent"
          : "linear-gradient(145deg, #000D1F 0%, #001530 40%, #00274C 100%)",
        padding: EMBED ? "10px" : "24px 16px 80px",
      }}
    >
      <style>{navCss}</style>
      {/* Ambient background blobs — desktop */}
      {!EMBED && (
        <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "-10%", right: "5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,203,5,0.12) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", bottom: "5%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,39,76,0.8) 0%, transparent 70%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", top: "40%", left: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.07) 0%, transparent 70%)", filter: "blur(50px)" }} />
        </div>
      )}

      {/* Top prototype label */}
      {!EMBED && (
        <div
          style={{
            position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 100,
            padding: "6px 22px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}
          className="flex items-center gap-2"
        >
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: MAIZE, boxShadow: `0 0 8px ${MAIZE}` }} className="animate-pulse" />
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.65rem", letterSpacing: "0.12em" }}>
            MICHIGAN VIP · USABILITY PROTOTYPE
          </span>
        </div>
      )}

      {/* Phone frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 390,
          height: "88vh",
          maxHeight: 844,
          minHeight: 620,
          borderRadius: 52,
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: `
            0 0 0 8px rgba(0,0,0,0.55),
            0 0 0 9px rgba(255,255,255,0.06),
            0 60px 120px rgba(0,0,0,0.7),
            0 0 80px rgba(255,203,5,0.07)
          `,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        {/* Phone background — this is what shows through glass cards */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #001530 0%, #00274C 60%, #001E3D 100%)" }} />

        {/* Inner ambient glows — visible through glass */}
        <div style={{ position: "absolute", top: -60, right: -40, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,203,5,0.15) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: 80, left: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(96,165,250,0.1) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", top: "45%", right: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,203,5,0.07) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

        {/* Dynamic island */}
        <div
          style={{
            position: "absolute", top: 13, left: "50%", transform: "translateX(-50%)",
            width: 118, height: 33,
            background: "#000",
            borderRadius: 20,
            zIndex: 100,
            display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 10, gap: 5,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#111", border: "1px solid #222" }} />
          <div style={{ width: 26, height: 8, borderRadius: 4, background: "#111" }} />
        </div>

        {/* Status bar — sits between Dynamic Island and view headers */}
        <StatusBar />

        {/* Views */}
        <div style={{ position: "relative", zIndex: 1, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", paddingTop: 56 }}>
          <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {renderView()}
          </div>

          {/* Bottom navigation — glass */}
          <div
            style={{
              background: "rgba(0,15,35,0.75)",
              backdropFilter: "blur(30px)",
              WebkitBackdropFilter: "blur(30px)",
              borderTop: "1px solid rgba(255,255,255,0.10)",
              flexShrink: 0,
              padding: "4px 6px 22px",
            }}
          >
            <div className="flex">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                const isPressing = navPressing === item.id;
                const isJustActivated = justActivated === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    onPointerDown={() => setNavPressing(item.id)}
                    onPointerUp={() => setNavPressing(null)}
                    onPointerLeave={() => setNavPressing(null)}
                    style={{
                      flex: 1,
                      display: "flex", flexDirection: "column", alignItems: "center",
                      paddingTop: 10, paddingBottom: 4, gap: 5,
                      background: "transparent", border: "none", cursor: "pointer",
                      position: "relative",
                      transform: isPressing ? "scale(0.90)" : "scale(1)",
                      transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    {/* Active pill indicator */}
                    {isActive && (
                      <div
                        style={{
                          position: "absolute", top: 0, left: "50%",
                          transform: "translateX(-50%)",
                          width: 36, height: 3,
                          background: `linear-gradient(90deg, ${MAIZE}80, ${MAIZE}, ${MAIZE}80)`,
                          borderRadius: "0 0 6px 6px",
                          boxShadow: `0 0 12px ${MAIZE}90`,
                          animation: "navPillIn 0.28s cubic-bezier(0.34,1.2,0.64,1)",
                        }}
                      />
                    )}
                    {/* Icon pill */}
                    <div
                      style={{
                        width: 48, height: 34,
                        borderRadius: 14,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: isActive ? "rgba(255,203,5,0.10)" : "transparent",
                        border: isActive ? "1px solid rgba(255,203,5,0.20)" : "1px solid transparent",
                        transition: "background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease",
                        boxShadow: isActive ? `0 0 16px rgba(255,203,5,0.15)` : "none",
                        animation: isJustActivated ? "navIconPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" : "none",
                      }}
                    >
                      {item.icon(isActive)}
                    </div>
                    <span
                      style={{
                        color: isActive ? MAIZE : MUTED_NAV,
                        fontSize: "0.58rem",
                        letterSpacing: "0.03em",
                        fontWeight: isActive ? 600 : 400,
                        transition: "color 0.22s ease, font-weight 0.22s ease, opacity 0.22s ease",
                        opacity: 1,
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subtle top glare */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "30%", background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)", borderRadius: "44px 44px 0 0", pointerEvents: "none", zIndex: 2 }} />
      </div>

      {/* Persona hint pills — desktop */}
      {!EMBED && (
        <div
          style={{
            position: "fixed", bottom: 22, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", zIndex: 10,
          }}
        >
          {personaHints.map(p => (
            <button
              key={p.name}
              onClick={() => setActiveTab(p.tab)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${p.color}35`,
                borderRadius: 100,
                padding: "5px 16px",
                display: "flex", alignItems: "center", gap: 7,
                cursor: "pointer",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
              <span style={{ color: `${p.color}CC`, fontSize: "0.62rem", letterSpacing: "0.02em" }}>
                {p.name}: {p.focus}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
