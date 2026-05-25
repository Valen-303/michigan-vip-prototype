import React, { useState, useEffect, useRef } from "react";
import { MapPin, Utensils, Trophy, Users, Star, Wifi, Zap, ArrowRight, Navigation } from "lucide-react";

const MAIZE = "#FFCB05";
const GLASS = "rgba(255,255,255,0.06)";
const GLASS_BORDER = "rgba(255,255,255,0.12)";
const GLASS_ACTIVE = "rgba(255,203,5,0.08)";
const MUTED = "rgba(255,255,255,0.42)";
const TEXT = "#FFFFFF";

const activeCardCss = `
@keyframes activeCardPulse {
  0%, 100% { box-shadow: 0 8px 32px rgba(255,203,5,0.10), inset 0 1px 0 rgba(255,255,255,0.08); }
  50%       { box-shadow: 0 8px 40px rgba(255,203,5,0.20), inset 0 1px 0 rgba(255,255,255,0.12); }
}
@keyframes arrowBounce {
  0%, 100% { transform: translateX(0); }
  50%       { transform: translateX(3px); }
}
@keyframes btnPress {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.93); }
  100% { transform: scale(1); }
}
.active-card-glow { animation: activeCardPulse 2.8s ease-in-out infinite; }
.arrow-bounce     { animation: arrowBounce 1.4s ease-in-out infinite; }
`;

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: "past" | "current" | "future";
  tag?: string;
}

const events: TimelineEvent[] = [
  {
    id: "1",
    time: "9:00 AM",
    title: "VIP Arrival — Lot SC-12",
    subtitle: "Reserved valet confirmed. Escort to Gate A.",
    icon: <MapPin size={14} />,
    status: "past",
    tag: "Done",
  },
  {
    id: "2",
    time: "10:30 AM",
    title: "Suite 402 Check-In",
    subtitle: "NFC wristband activated. Champagne reception.",
    icon: <Star size={14} />,
    status: "past",
    tag: "Done",
  },
  {
    id: "3",
    time: "11:00 AM",
    title: "Pre-Game VIP Brunch",
    subtitle: "Chef's Maize & Blue menu. Open bar until kickoff.",
    icon: <Utensils size={14} />,
    status: "past",
    tag: "Done",
  },
  {
    id: "4",
    time: "12:30 PM",
    title: "Head to Suite 402",
    subtitle: "Fast-track via Gate VIP-7. Your attendant is ready.",
    icon: <MapPin size={14} />,
    status: "current",
    tag: "NOW",
  },
  {
    id: "5",
    time: "1:00 PM",
    title: "Kickoff — Michigan vs. Ohio State",
    subtitle: "Q2 · 10:45 remaining · MICH 14 – OSU 7",
    icon: <Trophy size={14} />,
    status: "future",
  },
  {
    id: "6",
    time: "Halftime",
    title: "Halftime Show & Alumni Meetup",
    subtitle: "Sky Deck Level 5 · Harbaugh Alumni Panel.",
    icon: <Users size={14} />,
    status: "future",
  },
  {
    id: "7",
    time: "3:30 PM",
    title: "Post-Game VIP Reception",
    subtitle: "Field access · Locker room tour for Diamond members.",
    icon: <Star size={14} />,
    status: "future",
  },
];

export function TimelineView({ onNavigateToMap }: { onNavigateToMap?: () => void }) {
  const [time, setTime] = useState("");
  const [cardPressed, setCardPressed] = useState(false);
  const [mapBtnAnimating, setMapBtnAnimating] = useState(false);
  const currentCardRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const scrollToCurrent = () => {
      if (currentCardRef.current && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const card = currentCardRef.current;
        const cardTop = card.offsetTop;
        const cardHeight = card.offsetHeight;
        const containerHeight = container.clientHeight;
        container.scrollTop = cardTop - containerHeight / 2 + cardHeight / 2;
      }
    };

    // Double rAF ensures browser has completed layout + paint before measuring
    requestAnimationFrame(() => {
      requestAnimationFrame(scrollToCurrent);
    });
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{activeCardCss}</style>

      {/* ── HEADER — matches Map / Suite layout exactly ── */}
      <div
        style={{
          background: "rgba(0,10,25,0.45)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 18px 18px",
          flexShrink: 0,
        }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ color: MUTED, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em" }}>GAME-DAY SCHEDULE</p>
            <p style={{ color: TEXT, fontSize: "1rem", fontWeight: 600, marginTop: 1 }}>Timeline</p>
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

        {/* Match card — score + live status */}
        <div
          style={{
            background: GLASS,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1px solid ${GLASS_BORDER}`,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            padding: "12px 20px 16px",
          }}
        >
          {/* Top row: LIVE badge (left) + Q2·10:45 (center) */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: 10 }}>
            {/* LIVE badge — top left */}
            <div
              style={{
                background: "rgba(255,59,48,0.18)",
                border: "1px solid rgba(255,59,48,0.35)",
                borderRadius: 8,
                padding: "2px 9px",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF3B30" }} />
              <span style={{ color: "#FF6B6B", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em" }}>LIVE</span>
            </div>
            {/* Q2 · 10:45 — absolute center */}
            <span
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                color: MUTED,
                fontSize: "0.72rem",
              }}
            >
              Q2 · 10:45
            </span>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.09)", margin: "0 0 12px" }} />

          {/* Score row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: MAIZE, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>MICHIGAN</p>
              <p style={{ color: TEXT, fontSize: "2.4rem", fontWeight: 700, lineHeight: 1 }} className="tabular-nums">14</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 10,
                  padding: "4px 12px",
                }}
              >
                <span style={{ color: MUTED, fontSize: "0.68rem", fontWeight: 500 }}>VS</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#C41E3A", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.1em", marginBottom: 4 }}>OHIO ST.</p>
              <p style={{ color: TEXT, fontSize: "2.4rem", fontWeight: 700, lineHeight: 1 }} className="tabular-nums">7</p>
            </div>
          </div>
        </div>

        {/* Suite badge row */}
        <div className="flex gap-2 mt-3">
          {[
            { label: "Suite 402", color: "#4ADE80", glow: "#4ADE80" },
            { label: "Gate VIP-7", color: MAIZE, glow: MAIZE },
            { label: "Level 4 · North", color: "rgba(255,255,255,0.5)", glow: "transparent" },
          ].map(b => (
            <div
              key={b.label}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 100,
                padding: "3px 11px",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: b.color, boxShadow: `0 0 5px ${b.glow}` }} />
              <span style={{ color: b.color, fontSize: "0.62rem", fontWeight: 500 }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section label */}
      <div style={{ padding: "16px 20px 8px", flexShrink: 0 }}>
        <p style={{ color: MUTED, fontSize: "0.6rem", letterSpacing: "0.14em", fontWeight: 600 }}>YOUR GAME-DAY TIMELINE</p>
      </div>

      {/* Timeline scroll */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto" style={{ padding: "0 16px 20px", scrollbarWidth: "none" }}>
        <div style={{ position: "relative" }}>
          {/* Spine line */}
          <div
            style={{
              position: "absolute",
              left: 19,
              top: 0, bottom: 0,
              width: 1,
              background: "linear-gradient(to bottom, rgba(255,203,5,0.6), rgba(255,203,5,0.15) 60%, rgba(255,255,255,0.05))",
              pointerEvents: "none",
            }}
          />

          {events.map((ev) => {
            const isPast = ev.status === "past";
            const isCurrent = ev.status === "current";
            return (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  gap: 14,
                  marginBottom: 10,
                  opacity: isPast ? 0.38 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                {/* Timeline node */}
                <div style={{ width: 38, display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: isCurrent
                        ? `linear-gradient(135deg, ${MAIZE}, #E6B800)`
                        : isPast
                        ? "rgba(255,255,255,0.06)"
                        : GLASS,
                      backdropFilter: "blur(12px)",
                      WebkitBackdropFilter: "blur(12px)",
                      border: isCurrent
                        ? "none"
                        : isPast
                        ? "1px solid rgba(255,255,255,0.08)"
                        : `1px solid rgba(255,203,5,0.28)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: isCurrent ? "#00274C" : isPast ? MUTED : MAIZE,
                      boxShadow: isCurrent ? `0 0 20px rgba(255,203,5,0.45), 0 4px 12px rgba(0,0,0,0.3)` : "none",
                      flexShrink: 0,
                    }}
                  >
                    {ev.icon}
                  </div>
                </div>

                {/* Card */}
                {isCurrent ? (
                  /* ── ACTIVE CARD — fully interactive ── */
                  <div
                    className="active-card-glow"
                    style={{
                      flex: 1,
                      background: "rgba(255,203,5,0.08)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1.5px solid rgba(255,203,5,0.32)",
                      borderRadius: 20,
                      overflow: "hidden",
                    }}
                    ref={currentCardRef}
                  >
                    {/* Top shimmer stripe */}
                    <div style={{
                      height: 2,
                      background: `linear-gradient(90deg, transparent, ${MAIZE}60, transparent)`,
                    }} />

                    <div style={{ padding: "13px 15px 10px" }}>
                      {/* Header row */}
                      <div className="flex items-start">
                        <div style={{ flex: 1 }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ color: MUTED, fontSize: "0.62rem", fontWeight: 500 }}>{ev.time}</span>
                            <span
                              style={{
                                background: `linear-gradient(90deg, ${MAIZE}, #E6B800)`,
                                color: "#00274C",
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                borderRadius: 6,
                                padding: "2px 7px",
                              }}
                            >
                              NOW
                            </span>
                            <div
                              className="animate-pulse"
                              style={{ width: 6, height: 6, borderRadius: "50%", background: MAIZE, boxShadow: `0 0 6px ${MAIZE}` }}
                            />
                          </div>
                          <p style={{ color: TEXT, fontSize: "0.84rem", fontWeight: 700, lineHeight: 1.35 }}>
                            {ev.title}
                          </p>
                          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: "0.7rem", marginTop: 3, lineHeight: 1.5 }}>
                            {ev.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div style={{ margin: "10px 0 9px", borderTop: "1px solid rgba(255,203,5,0.14)" }} />

                      {/* CTA action row */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              width: 22, height: 22,
                              borderRadius: "50%",
                              background: "rgba(74,222,128,0.15)",
                              border: "1px solid rgba(74,222,128,0.30)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <Navigation size={10} color="#4ADE80" />
                          </div>
                          <span style={{ color: "rgba(255,255,255,0.50)", fontSize: "0.63rem" }}>Gate VIP-7 · Fast-track</span>
                        </div>
                        {/* Open in Map — functional button */}
                        <button
                          onClick={() => {
                            setMapBtnAnimating(true);
                            setTimeout(() => setMapBtnAnimating(false), 400);
                            onNavigateToMap?.();
                          }}
                          onPointerDown={() => setCardPressed(true)}
                          onPointerUp={() => setCardPressed(false)}
                          onPointerLeave={() => setCardPressed(false)}
                          style={{
                            background: cardPressed
                              ? `linear-gradient(90deg, ${MAIZE}35, ${MAIZE}28)`
                              : `linear-gradient(90deg, ${MAIZE}20, ${MAIZE}14)`,
                            border: `1px solid rgba(255,203,5,${cardPressed ? "0.55" : "0.38"})`,
                            borderRadius: 100,
                            padding: "5px 12px",
                            display: "flex", alignItems: "center", gap: 5,
                            cursor: "pointer",
                            transition: "background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
                            boxShadow: cardPressed ? `0 0 14px rgba(255,203,5,0.25)` : "none",
                            animation: mapBtnAnimating ? "btnPress 0.4s cubic-bezier(0.36,0.07,0.19,0.97)" : "none",
                          }}
                        >
                          <span style={{ color: MAIZE, fontSize: "0.62rem", fontWeight: 600 }}>Open in Map</span>
                          <ArrowRight size={11} color={MAIZE} className="arrow-bounce" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── NORMAL CARD ── */
                  <div style={{
                    background: isPast ? "rgba(255,255,255,0.025)" : GLASS,
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: isPast ? "1px solid rgba(255,255,255,0.06)" : `1px solid ${GLASS_BORDER}`,
                    borderRadius: 20,
                    padding: "13px 15px",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    flex: 1,
                    transition: "all 0.3s ease",
                  }}>
                    <div className="flex items-start justify-between">
                      <div style={{ flex: 1 }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: MUTED, fontSize: "0.62rem", fontWeight: 500 }}>{ev.time}</span>
                          {ev.tag && (
                            <span
                              style={{
                                background: "rgba(255,255,255,0.10)",
                                color: MUTED,
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                borderRadius: 6,
                                padding: "2px 7px",
                              }}
                            >
                              {ev.tag}
                            </span>
                          )}
                        </div>
                        <p style={{ color: TEXT, fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.35 }}>
                          {ev.title}
                        </p>
                        <p style={{ color: MUTED, fontSize: "0.7rem", marginTop: 3, lineHeight: 1.5 }}>
                          {ev.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}