import React, { useState } from "react";
import { Baby, Users, Coffee, Navigation, ChevronRight, MapPin, X, WifiOff } from "lucide-react";

const MAIZE = "#FFCB05";
const GLASS = "rgba(255,255,255,0.06)";
const GLASS_BORDER = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.42)";
const TEXT = "#FFFFFF";
const FOOD_COLOR = "#FB923C";

const mapCss = `
@keyframes btnPress {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.91); }
  100% { transform: scale(1); }
}
@keyframes chipPress {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.88); }
  100% { transform: scale(1); }
}
@keyframes popIn {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
`;

type Filter = "nursing" | "restrooms" | "food";

interface Amenity {
  id: string;
  type: Filter;
  label: string;
  x: number;
  y: number;
  detail: string;
  level: string;
}

const amenities: Amenity[] = [
  { id: "n1", type: "nursing",   label: "Nursing Room",    x: 71, y: 52, detail: "Level 2, Gate B Corridor",  level: "Level 2" },
  { id: "n2", type: "nursing",   label: "Nursing Room",    x: 28, y: 66, detail: "Level 3, Gate D West Wing", level: "Level 3" },
  { id: "r1", type: "restrooms", label: "Restroom",        x: 54, y: 31, detail: "Gate A, North Concourse",   level: "Level 1" },
  { id: "r2", type: "restrooms", label: "Restroom",        x: 20, y: 45, detail: "Gate C, West Concourse",    level: "Level 2" },
  { id: "r3", type: "restrooms", label: "Restroom",        x: 80, y: 68, detail: "Gate B, East Concourse",    level: "Level 1" },
  { id: "f1", type: "food",      label: "VIP Concession",  x: 44, y: 22, detail: "Catering Desk A, North",    level: "Level 4" },
  { id: "f2", type: "food",      label: "Suite Level Bar", x: 65, y: 77, detail: "Suite Corridor, East",       level: "Level 4" },
  { id: "f3", type: "food",      label: "Concession",      x: 31, y: 36, detail: "West Concourse, Gate D",    level: "Level 2" },
];

const filterConfig = [
  { id: "nursing"   as Filter, label: "Nursing Rooms", icon: <Baby   size={13} />, color: "#F9A8D4", bg: "rgba(249,168,212,0.10)" },
  { id: "restrooms" as Filter, label: "Restrooms",     icon: <Users  size={13} />, color: "#93C5FD", bg: "rgba(147,197,253,0.10)" },
  { id: "food"      as Filter, label: "Food",           icon: <Coffee size={13} />, color: FOOD_COLOR, bg: "rgba(251,146,60,0.10)" },
];

const amenityMeta = {
  nursing:   { color: "#F9A8D4", icon: <Baby   size={11} /> },
  restrooms: { color: "#93C5FD", icon: <Users  size={11} /> },
  food:      { color: FOOD_COLOR, icon: <Coffee size={11} /> },
};

export function MapView() {
  const [activeFilters, setActiveFilters] = useState<Filter[]>(["nursing", "restrooms", "food"]);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [pressedChip, setPressedChip] = useState<Filter | null>(null);
  const [chipDown, setChipDown] = useState<Filter | null>(null);
  const [routeAnimating, setRouteAnimating] = useState(false);
  const [routeDown, setRouteDown] = useState(false);
  const [closeAnimating, setCloseAnimating] = useState(false);

  const toggle = (f: Filter) => {
    setPressedChip(f);
    setTimeout(() => setPressedChip(null), 400);
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
    setSelectedAmenity(null);
  };

  const visible = amenities.filter(a => activeFilters.includes(a.type));

  return (
    <div className="flex flex-col h-full relative" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{mapCss}</style>

      {/* ── HEADER ── title + DIAMOND VIP + route card */}
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
            <p style={{ color: MUTED, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em" }}>WAYFINDING</p>
            <p style={{ color: TEXT, fontSize: "1rem", fontWeight: 600, marginTop: 1 }}>Big House Navigator</p>
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

        {/* Route info glass card */}
        <div
          style={{
            background: GLASS,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${GLASS_BORDER}`,
            borderRadius: 16,
            padding: "10px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,203,5,0.12)",
                border: "1px solid rgba(255,203,5,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <MapPin size={14} color={MAIZE} />
            </div>
            <div>
              <p style={{ color: TEXT, fontSize: "0.75rem", fontWeight: 600 }}>Your Location → Suite 402</p>
              <p style={{ color: MUTED, fontSize: "0.63rem", marginTop: 1 }}>Gate VIP-7 · Level 4 North</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: MAIZE, fontSize: "0.78rem", fontWeight: 700 }}>~4 min</p>
            <p style={{ color: MUTED, fontSize: "0.62rem" }}>340 ft</p>
          </div>
        </div>
      </div>

      {/* ── OFFLINE BADGE — between header and map, no right icon ── */}
      <div
        style={{
          background: "rgba(0,8,20,0.35)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 18px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            background: "rgba(74,222,128,0.08)",
            border: "1px solid rgba(74,222,128,0.28)",
            borderRadius: 16,
            padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 12,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
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
            <WifiOff size={14} color="#4ADE80" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#4ADE80", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em" }}>OFFLINE MAPS ACTIVE</p>
            <p style={{ color: "rgba(74,222,128,0.6)", fontSize: "0.62rem", marginTop: 1 }}>Big House map cached · No signal needed</p>
          </div>
        </div>
      </div>

      {/* ── MAP CARD ── */}
      <div style={{ flex: 1, padding: "12px 14px 14px", overflow: "hidden" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 24,
            overflow: "hidden",
            height: "100%",
            position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.10)",
          }}
        >
          {/* Top glare stripe */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
              pointerEvents: "none", zIndex: 3,
            }}
          />

          {/* ── FILTER CHIPS — inside map card, top-left overlay ── */}
          <div
            style={{
              position: "absolute", top: 12, left: 12, right: 12,
              display: "flex", gap: 7,
              zIndex: 4,
              pointerEvents: "auto",
            }}
          >
            {filterConfig.map(f => {
              const on = activeFilters.includes(f.id);
              const isDown = chipDown === f.id;
              return (
                <button
                  key={f.id}
                  onPointerDown={() => setChipDown(f.id)}
                  onPointerUp={() => setChipDown(null)}
                  onPointerLeave={() => setChipDown(null)}
                  onClick={() => toggle(f.id)}
                  style={{
                    background: on ? f.bg : "rgba(8,20,52,0.62)",
                    border: `1px solid ${on ? f.color + "55" : "rgba(255,255,255,0.14)"}`,
                    borderRadius: 100,
                    padding: "5px 11px",
                    display: "flex", alignItems: "center", gap: 5,
                    cursor: "pointer",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                    flexShrink: 0,
                    boxShadow: on
                      ? isDown
                        ? `0 0 18px ${f.color}30`
                        : `0 0 12px ${f.color}20, inset 0 1px 0 rgba(255,255,255,0.08)`
                      : "inset 0 1px 0 rgba(255,255,255,0.06)",
                    animation: pressedChip === f.id ? "chipPress 0.4s cubic-bezier(0.36,0.07,0.19,0.97)" : "none",
                  }}
                >
                  <span style={{ color: on ? f.color : MUTED, display: "flex", alignItems: "center" }}>{f.icon}</span>
                  <span style={{ color: on ? f.color : MUTED, fontSize: "0.68rem", fontWeight: on ? 600 : 400, whiteSpace: "nowrap" }}>
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SVG Stadium */}
          <svg
            viewBox="0 0 100 100"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <radialGradient id="fieldGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="#1B5E35" />
                <stop offset="100%" stopColor="#0F3A20" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            <ellipse cx="50" cy="50" rx="44" ry="40" fill="rgba(4,22,58,0.22)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />

            {[...Array(12)].map((_, i) => {
              const a0 = (i / 12) * Math.PI * 2;
              const a1 = ((i + 1) / 12) * Math.PI * 2;
              const r1 = 27, r2 = 43;
              const pts = [
                [50 + r1 * Math.cos(a0), 50 + r1 * 0.91 * Math.sin(a0)],
                [50 + r2 * Math.cos(a0), 50 + r2 * 0.91 * Math.sin(a0)],
                [50 + r2 * Math.cos(a1), 50 + r2 * 0.91 * Math.sin(a1)],
                [50 + r1 * Math.cos(a1), 50 + r1 * 0.91 * Math.sin(a1)],
              ];
              return (
                <path
                  key={i}
                  d={`M${pts.map(p => p.join(",")).join("L")}Z`}
                  fill={i % 2 === 0 ? "rgba(0,44,90,0.18)" : "rgba(0,30,65,0.14)"}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="0.25"
                />
              );
            })}

            {[31, 35, 39, 43].map(r => (
              <ellipse key={r} cx="50" cy="50" rx={r * 1.05} ry={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.25" />
            ))}

            <ellipse cx="50" cy="50" rx="25" ry="22.5" fill="url(#fieldGrad)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" style={{ opacity: 0.55 }} />
            {[...Array(5)].map((_, i) => (
              <line key={i} x1={28 + i * 9} y1="28" x2={28 + i * 9} y2="72" stroke="rgba(255,255,255,0.07)" strokeWidth="0.2" />
            ))}
            <line x1="25" y1="50" x2="75" y2="50" stroke="rgba(255,255,255,0.07)" strokeWidth="0.2" />
            <text x="50" y="52" textAnchor="middle" fill="rgba(255,255,255,0.10)" fontSize="2.8" fontWeight="bold" letterSpacing="0.4">MICHIGAN</text>

            <ellipse cx="50" cy="50" rx="44" ry="40" fill="none" stroke="rgba(255,203,5,0.12)" strokeWidth="1" />

            <path
              d="M 50 90 L 50 76 L 63 71 L 70 64 L 77 55 L 75 44 L 71 38"
              fill="none"
              stroke={MAIZE}
              strokeWidth="1.4"
              strokeDasharray="2.5 2"
              strokeLinecap="round"
              filter="url(#glow)"
              opacity="0.85"
            />
            <polygon points="71,34 68,40 74,40" fill={MAIZE} opacity="0.85" />

            <circle cx="50" cy="90" r="3" fill="#4ADE80" filter="url(#glow)" />
            <circle cx="50" cy="90" r="5" fill="none" stroke="#4ADE80" strokeWidth="0.7" opacity="0.4" />
            <text x="50" y="96" textAnchor="middle" fill="#4ADE80" fontSize="2.4" fontWeight="600">YOU</text>

            <circle cx="71" cy="38" r="3.5" fill={MAIZE} filter="url(#glow)" />
            <circle cx="71" cy="38" r="6"   fill="none" stroke={MAIZE} strokeWidth="0.7" opacity="0.35" />
            <text x="71" y="33.5" textAnchor="middle" fill={MAIZE} fontSize="2.6" fontWeight="700">402</text>

            {[
              { label: "Gate A", x: 50, y: 7,  vip: false },
              { label: "Gate B", x: 93, y: 50, vip: false },
              { label: "Gate C", x: 50, y: 96, vip: false },
              { label: "Gate D", x: 7,  y: 50, vip: false },
              { label: "VIP-7",  x: 84, y: 23, vip: true  },
            ].map(g => (
              <text
                key={g.label}
                x={g.x} y={g.y}
                textAnchor="middle"
                fill={g.vip ? MAIZE : "rgba(255,255,255,0.36)"}
                fontSize={g.vip ? "3" : "2.3"}
                fontWeight={g.vip ? "700" : "400"}
              >
                {g.label}
              </text>
            ))}

            {visible.map(a => {
              const meta = amenityMeta[a.type];
              const sel = selectedAmenity?.id === a.id;
              return (
                <g key={a.id} onClick={() => setSelectedAmenity(sel ? null : a)} style={{ cursor: "pointer" }}>
                  <circle
                    cx={a.x} cy={a.y}
                    r={sel ? 3.8 : 2.2}
                    fill={meta.color}
                    opacity={sel ? 0.95 : 0.50}
                    filter={sel ? "url(#glow)" : undefined}
                  />
                  {sel && <circle cx={a.x} cy={a.y} r="6" fill="none" stroke={meta.color} strokeWidth="0.7" opacity="0.35" />}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div
            style={{
              position: "absolute", bottom: 12, left: 12,
              background: "rgba(8,20,52,0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 14,
              padding: "9px 12px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.09)",
              zIndex: 2,
            }}
          >
            <p style={{ color: MUTED, fontSize: "0.52rem", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 6 }}>LEGEND</p>
            {[
              { color: "#4ADE80",  label: "Your Location" },
              { color: MAIZE,      label: "Suite 402" },
              { color: "#F9A8D4",  label: "Nursing Room" },
              { color: "#93C5FD",  label: "Restroom" },
              { color: FOOD_COLOR, label: "Food" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2" style={{ marginBottom: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                <span style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.58rem" }}>{l.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div style={{ width: 16, borderTop: `1.5px dashed ${MAIZE}80` }} />
              <span style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.58rem" }}>Route</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amenity detail popup */}
      {selectedAmenity && (() => {
        const meta = amenityMeta[selectedAmenity.type];
        return (
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 14, right: 14,
              background: "rgba(0,15,40,0.85)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: `1px solid ${meta.color}40`,
              borderRadius: 22,
              padding: "14px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.07)`,
              zIndex: 10,
              animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                style={{
                  width: 40, height: 40,
                  borderRadius: 13,
                  background: `${meta.color}15`,
                  border: `1px solid ${meta.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: meta.color, flexShrink: 0,
                }}
              >
                {meta.icon}
              </div>
              <div>
                <p style={{ color: TEXT, fontSize: "0.8rem", fontWeight: 600 }}>{selectedAmenity.label}</p>
                <p style={{ color: MUTED, fontSize: "0.65rem", marginTop: 2 }}>{selectedAmenity.detail}</p>
                <p style={{ color: meta.color, fontSize: "0.6rem", marginTop: 2, fontWeight: 500 }}>{selectedAmenity.level}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div
                onPointerDown={() => setRouteDown(true)}
                onPointerUp={() => setRouteDown(false)}
                onPointerLeave={() => setRouteDown(false)}
                onClick={() => {
                  setRouteAnimating(true);
                  setTimeout(() => setRouteAnimating(false), 400);
                }}
                style={{
                  background: routeDown ? `${meta.color}28` : `${meta.color}14`,
                  border: `1px solid ${routeDown ? meta.color + "55" : meta.color + "30"}`,
                  borderRadius: 10,
                  padding: "6px 12px",
                  display: "flex", alignItems: "center", gap: 4,
                  cursor: "pointer",
                  transition: "background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
                  boxShadow: routeDown ? `0 0 14px ${meta.color}35` : "none",
                  animation: routeAnimating ? "btnPress 0.4s cubic-bezier(0.36,0.07,0.19,0.97)" : "none",
                }}
              >
                <Navigation size={11} color={meta.color} />
                <span style={{ color: meta.color, fontSize: "0.65rem", fontWeight: 600 }}>Route</span>
              </div>
              <button
                onClick={() => {
                  setCloseAnimating(true);
                  setTimeout(() => { setCloseAnimating(false); setSelectedAmenity(null); }, 220);
                }}
                style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  animation: closeAnimating ? "btnPress 0.22s ease" : "none",
                  transition: "background 0.15s ease",
                }}
              >
                <X size={12} color={MUTED} />
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}