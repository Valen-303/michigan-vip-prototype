import React, { useState, useCallback } from "react";
import {
  Snowflake, Bell, UtensilsCrossed, AlertTriangle,
  Tv2, Wine, Sparkles, PhoneCall,
  CheckCircle, Clock, Star, ChevronDown, X,
} from "lucide-react";

const MAIZE = "#FFCB05";
const GLASS = "rgba(255,255,255,0.06)";
const GLASS_BORDER = "rgba(255,255,255,0.12)";
const MUTED = "rgba(255,255,255,0.42)";
const TEXT = "#FFFFFF";

const css = `
@keyframes toastIn {
  from { opacity: 0; transform: translateY(-14px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
@keyframes toastOut {
  from { opacity: 1; transform: translateY(0)    scale(1); }
  to   { opacity: 0; transform: translateY(-8px) scale(0.97); }
}
@keyframes btnPress {
  0%   { transform: scale(1); }
  40%  { transform: scale(0.95); }
  100% { transform: scale(1); }
}
@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}
@keyframes reqCardIn {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}
`;

interface Toast {
  id: number;
  title: string;
  sub: string;
  type: "success" | "urgent";
  leaving?: boolean;
}
interface Request {
  id: number;
  label: string;
  time: string;
  status: "sent" | "active" | "done";
}

const extraBtns = [
  { id: "tv",        label: "AV Controls", sub: "TV & sound",      icon: <Tv2 size={18} />,       color: "#6EE7B7" },
  { id: "bar",       label: "Bar Service",  sub: "Premium spirits", icon: <Wine size={18} />,      color: "#F9A8D4" },
  { id: "cleaning",  label: "Housekeeping", sub: "Suite refresh",   icon: <Sparkles size={18} />,  color: "#94A3B8" },
  { id: "concierge", label: "Concierge",    sub: "Any request",     icon: <PhoneCall size={18} />, color: MAIZE },
];

let toastId = 0;
let reqId = 0;

export function SuiteCommandView() {
  const [toasts, setToasts]         = useState<Toast[]>([]);
  const [pressed, setPressed]       = useState<string | null>(null);
  const [requests, setRequests]     = useState<Request[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const dismissToast = useCallback((id: number) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);

  const fire = (title: string, sub: string, type: "success" | "urgent", reqLabel: string, btnId: string) => {
    setPressed(btnId);
    setTimeout(() => setPressed(null), 350);
    const tid = ++toastId;
    setToasts(prev => [...prev, { id: tid, title, sub, type }]);
    setTimeout(() => dismissToast(tid), 3500);
    const rid = ++reqId;
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setRequests(prev => [{ id: rid, label: reqLabel, time: now, status: "sent" }, ...prev.slice(0, 4)]);
    setTimeout(() => setRequests(prev => prev.map(r => r.id === rid ? { ...r, status: "active" } : r)), 3000);
    setTimeout(() => setRequests(prev => prev.map(r => r.id === rid ? { ...r, status: "done"   } : r)), 9000);
  };

  const handleExtra = (btn: typeof extraBtns[0]) => {
    const map: Record<string, [string, string]> = {
      tv:        ["AV Panel Activated",     "Control panel accessible above suite TV"],
      bar:       ["Bar Service Notified ✓", "Premium selection incoming to Suite 402"],
      cleaning:  ["Housekeeping Scheduled", "Refresh between quarters"],
      concierge: ["Concierge Standing By",  "Your concierge will call shortly"],
    };
    const [title, sub] = map[btn.id];
    fire(title, sub, "success", btn.label, btn.id);
  };

  const statusMeta = (s: Request["status"]) => ({
    sent:   { label: "Sent",        color: MUTED,     icon: <Clock size={13} color={MUTED} />,      dot: MUTED },
    active: { label: "In Progress", color: MAIZE,     icon: <Clock size={13} color={MAIZE} />,      dot: MAIZE },
    done:   { label: "Completed",   color: "#4ADE80", icon: <CheckCircle size={13} color="#4ADE80" />, dot: "#4ADE80" },
  }[s]);

  const latest = requests[0] ?? null;
  const previous = requests.slice(1);
  const hasPrevious = previous.length > 0;

  return (
    <div className="flex flex-col h-full relative" style={{ fontFamily: "Inter, sans-serif" }}>
      <style>{css}</style>

      {/* Toast stack */}
      <div style={{ position: "absolute", top: 12, left: 12, right: 12, zIndex: 50, display: "flex", flexDirection: "column", gap: 8, pointerEvents: "none" }}>
        {toasts.map(t => (
          <div
            key={t.id}
            style={{
              background: t.type === "urgent" ? "rgba(127,29,29,0.85)" : "rgba(5,46,22,0.85)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: t.type === "urgent" ? "1px solid rgba(239,68,68,0.45)" : "1px solid rgba(74,222,128,0.35)",
              borderRadius: 20,
              padding: "12px 14px",
              display: "flex", alignItems: "center", gap: 12,
              boxShadow: t.type === "urgent"
                ? "0 12px 40px rgba(239,68,68,0.22), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "0 12px 40px rgba(74,222,128,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
              animation: t.leaving ? "toastOut 0.3s ease forwards" : "toastIn 0.35s ease",
              pointerEvents: "all",
            }}
          >
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: t.type === "urgent" ? "rgba(239,68,68,0.25)" : "rgba(74,222,128,0.20)", border: t.type === "urgent" ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(74,222,128,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {t.type === "urgent" ? <AlertTriangle size={15} color="#FCA5A5" /> : <CheckCircle size={15} color="#4ADE80" />}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: TEXT, fontSize: "0.78rem", fontWeight: 600 }}>{t.title}</p>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.63rem", marginTop: 2 }}>{t.sub}</p>
            </div>
            <button onClick={() => dismissToast(t.id)} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
              <X size={11} color={MUTED} />
            </button>
          </div>
        ))}
      </div>

      {/* ── HEADER ── */}
      <div
        style={{
          background: "rgba(0,10,25,0.45)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "14px 18px",
          flexShrink: 0,
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p style={{ color: MUTED, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.12em" }}>CONTROL CENTER</p>
            <p style={{ color: TEXT, fontSize: "1rem", fontWeight: 600, marginTop: 1 }}>Suite 402 Command</p>
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

        {/* ── LIVE REQUEST CARD ── */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              background: latest
                ? (latest.status === "active"
                    ? "rgba(255,203,5,0.07)"
                    : latest.status === "done"
                    ? "rgba(74,222,128,0.06)"
                    : GLASS)
                : GLASS,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: latest
                ? (latest.status === "active"
                    ? "1px solid rgba(255,203,5,0.28)"
                    : latest.status === "done"
                    ? "1px solid rgba(74,222,128,0.25)"
                    : `1px solid ${GLASS_BORDER}`)
                : `1px solid ${GLASS_BORDER}`,
              borderRadius: 16,
              padding: "10px 14px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              boxShadow: latest?.status === "active"
                ? "0 0 20px rgba(255,203,5,0.10), inset 0 1px 0 rgba(255,255,255,0.06)"
                : "inset 0 1px 0 rgba(255,255,255,0.06)",
              transition: "background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease",
            }}
          >
            {/* Left: icon + text */}
            <div className="flex items-center gap-3" style={{ flex: 1, minWidth: 0 }}>
              {/* Status icon circle */}
              <div
                style={{
                  width: 32, height: 32,
                  borderRadius: "50%",
                  background: latest
                    ? (latest.status === "active"
                        ? "rgba(255,203,5,0.15)"
                        : latest.status === "done"
                        ? "rgba(74,222,128,0.15)"
                        : "rgba(255,255,255,0.06)")
                    : "rgba(255,255,255,0.06)",
                  border: latest
                    ? (latest.status === "active"
                        ? "1px solid rgba(255,203,5,0.30)"
                        : latest.status === "done"
                        ? "1px solid rgba(74,222,128,0.30)"
                        : "1px solid rgba(255,255,255,0.12)")
                    : "1px solid rgba(255,255,255,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.4s ease, border-color 0.4s ease",
                }}
              >
                {latest ? statusMeta(latest.status).icon : <CheckCircle size={14} color={MUTED} />}
              </div>

              {/* Text */}
              <div style={{ minWidth: 0 }}>
                {latest ? (
                  <>
                    <p
                      style={{ color: TEXT, fontSize: "0.78rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                      key={latest.id}
                    >
                      {latest.label}
                    </p>
                    <div className="flex items-center gap-1.5" style={{ marginTop: 2 }}>
                      {/* animated dot */}
                      <div
                        style={{
                          width: 5, height: 5, borderRadius: "50%",
                          background: statusMeta(latest.status).dot,
                          boxShadow: latest.status === "active" ? `0 0 5px ${statusMeta(latest.status).dot}` : "none",
                          animation: latest.status === "active" ? "pulse 1.5s ease-in-out infinite" : "none",
                          flexShrink: 0,
                        }}
                        className={latest.status === "active" ? "animate-pulse" : ""}
                      />
                      <p style={{ color: statusMeta(latest.status).color, fontSize: "0.62rem", fontWeight: 500 }}>
                        {statusMeta(latest.status).label}
                      </p>
                      <span style={{ color: MUTED, fontSize: "0.62rem" }}>· {latest.time}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p style={{ color: TEXT, fontSize: "0.78rem", fontWeight: 600 }}>No Active Requests</p>
                    <p style={{ color: MUTED, fontSize: "0.62rem", marginTop: 2 }}>All clear · Suite 402 ready</p>
                  </>
                )}
              </div>
            </div>

            {/* Right: status badge + history toggle */}
            <div className="flex items-center gap-2" style={{ flexShrink: 0, marginLeft: 8 }}>
              {latest && (
                <div
                  style={{
                    background: `${statusMeta(latest.status).color}14`,
                    border: `1px solid ${statusMeta(latest.status).color}30`,
                    borderRadius: 8,
                    padding: "3px 9px",
                  }}
                >
                  <span style={{ color: statusMeta(latest.status).color, fontSize: "0.6rem", fontWeight: 600 }}>
                    {statusMeta(latest.status).label}
                  </span>
                </div>
              )}

              {/* Dropdown toggle — only when previous requests exist */}
              {hasPrevious && (
                <button
                  onClick={() => setHistoryOpen(h => !h)}
                  style={{
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: historyOpen ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.05)",
                    border: historyOpen
                      ? "1px solid rgba(255,255,255,0.22)"
                      : "1px solid rgba(255,255,255,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "background 0.2s ease, border-color 0.2s ease",
                  }}
                >
                  <ChevronDown
                    size={13}
                    color={historyOpen ? TEXT : MUTED}
                    style={{
                      transform: historyOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.25s cubic-bezier(0.34,1.2,0.64,1)",
                    }}
                  />
                </button>
              )}
            </div>
          </div>

          {/* ── HISTORY DROPDOWN ── */}
          {historyOpen && hasPrevious && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 6px)",
                left: 0, right: 0,
                background: "rgba(0,12,30,0.92)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: "0 16px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.07)",
                zIndex: 30,
                animation: "dropdownIn 0.22s cubic-bezier(0.34,1.2,0.64,1)",
              }}
            >
              {/* Header row */}
              <div
                style={{
                  padding: "8px 14px 6px",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <p style={{ color: MUTED, fontSize: "0.56rem", fontWeight: 600, letterSpacing: "0.12em" }}>
                  PREVIOUS REQUESTS
                </p>
                <button
                  onClick={() => setHistoryOpen(false)}
                  style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  <X size={9} color={MUTED} />
                </button>
              </div>

              {/* Previous request rows */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {previous.map((req, i) => {
                  const meta = statusMeta(req.status);
                  return (
                    <div
                      key={req.id}
                      style={{
                        padding: "9px 14px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        borderBottom: i < previous.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                        animation: `reqCardIn 0.2s ease ${i * 0.04}s both`,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        {meta.icon}
                        <div>
                          <p style={{ color: "rgba(255,255,255,0.80)", fontSize: "0.72rem", fontWeight: 500 }}>{req.label}</p>
                          <p style={{ color: MUTED, fontSize: "0.58rem", marginTop: 1 }}>{req.time}</p>
                        </div>
                      </div>
                      <div
                        style={{
                          background: `${meta.color}10`,
                          border: `1px solid ${meta.color}25`,
                          borderRadius: 7,
                          padding: "2px 8px",
                        }}
                      >
                        <span style={{ color: meta.color, fontSize: "0.58rem", fontWeight: 600 }}>{meta.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── BODY ── */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "14px 14px 20px", scrollbarWidth: "none" }}
        onClick={() => historyOpen && setHistoryOpen(false)}
      >

        {/* ── QUICK ACTIONS ── */}
        <p style={{ color: MUTED, fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.12em", marginBottom: 10 }}>QUICK ACTIONS</p>

        {/* Row 1 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>

          {/* Request Ice */}
          <button
            onClick={() => fire("Ice Request Sent ✓", "ETA ~5 min · Marcus en route to Suite 402", "success", "Request Ice", "ice")}
            style={{
              background: "linear-gradient(145deg, rgba(147,197,253,0.16) 0%, rgba(147,197,253,0.06) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(147,197,253,0.28)",
              borderRadius: 22,
              padding: "18px 15px 16px",
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12,
              cursor: "pointer", textAlign: "left",
              boxShadow: "0 8px 28px rgba(147,197,253,0.10), inset 0 1px 0 rgba(255,255,255,0.10)",
              animation: pressed === "ice" ? "btnPress 0.35s ease" : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(147,197,253,0.16)", border: "1px solid rgba(147,197,253,0.30)", display: "flex", alignItems: "center", justifyContent: "center", color: "#93C5FD", boxShadow: "0 0 18px rgba(147,197,253,0.15)" }}>
              <Snowflake size={24} strokeWidth={1.6} />
            </div>
            <div>
              <p style={{ color: TEXT, fontSize: "0.85rem", fontWeight: 700, lineHeight: 1.25 }}>Request Ice</p>
              <p style={{ color: "rgba(147,197,253,0.65)", fontSize: "0.62rem", marginTop: 4 }}>Delivered in 5 min</p>
            </div>
          </button>

          {/* Call Attendant */}
          <button
            onClick={() => fire("Attendant Notified ✓", "Marcus is heading to Suite 402 now", "success", "Call Attendant", "attendant")}
            style={{
              background: "linear-gradient(145deg, rgba(255,203,5,0.14) 0%, rgba(255,203,5,0.05) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,203,5,0.30)",
              borderRadius: 22,
              padding: "18px 15px 16px",
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12,
              cursor: "pointer", textAlign: "left",
              boxShadow: `0 8px 28px rgba(255,203,5,0.10), inset 0 1px 0 rgba(255,255,255,0.10)`,
              animation: pressed === "attendant" ? "btnPress 0.35s ease" : "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
          >
            <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(255,203,5,0.14)", border: "1px solid rgba(255,203,5,0.28)", display: "flex", alignItems: "center", justifyContent: "center", color: MAIZE, boxShadow: `0 0 18px rgba(255,203,5,0.15)` }}>
              <Bell size={24} strokeWidth={1.6} />
            </div>
            <div>
              <p style={{ color: TEXT, fontSize: "0.85rem", fontWeight: 700, lineHeight: 1.25 }}>Call Attendant</p>
              <p style={{ color: "rgba(255,203,5,0.60)", fontSize: "0.62rem", marginTop: 4 }}>Personal service</p>
            </div>
          </button>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>

          {/* Order Catering */}
          <button
            onClick={() => fire("Catering Queued ✓", "Full VIP menu opening · Served next quarter", "success", "Order Catering", "catering")}
            style={{
              background: GLASS,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(196,181,253,0.22)",
              borderRadius: 22,
              padding: "16px 15px",
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10,
              cursor: "pointer", textAlign: "left",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
              animation: pressed === "catering" ? "btnPress 0.35s ease" : "none",
              transition: "border-color 0.2s",
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 13, background: "rgba(196,181,253,0.12)", border: "1px solid rgba(196,181,253,0.22)", display: "flex", alignItems: "center", justifyContent: "center", color: "#C4B5FD" }}>
              <UtensilsCrossed size={20} strokeWidth={1.6} />
            </div>
            <div>
              <p style={{ color: TEXT, fontSize: "0.80rem", fontWeight: 600, lineHeight: 1.25 }}>Order Catering</p>
              <p style={{ color: MUTED, fontSize: "0.62rem", marginTop: 3 }}>Full VIP menu</p>
            </div>
          </button>

          {/* Medical Emergency */}
          <button
            onClick={() => fire("⚠ Medical Alert Sent", "First-aid team dispatched to Suite 402", "urgent", "Medical Emergency", "medical")}
            style={{
              background: "transparent",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1.5px solid rgba(239,68,68,0.40)",
              borderRadius: 22,
              padding: "16px 15px",
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10,
              cursor: "pointer", textAlign: "left",
              boxShadow: "none",
              animation: pressed === "medical" ? "btnPress 0.35s ease" : "none",
              transition: "border-color 0.2s, background 0.2s",
            }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 13, background: "transparent", border: "1.5px solid rgba(239,68,68,0.38)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FCA5A5" }}>
              <AlertTriangle size={20} strokeWidth={1.6} />
            </div>
            <div>
              <p style={{ color: "#FCA5A5", fontSize: "0.80rem", fontWeight: 600, lineHeight: 1.25 }}>Medical Emergency</p>
              <p style={{ color: "rgba(252,165,165,0.50)", fontSize: "0.62rem", marginTop: 3 }}>Immediate response</p>
            </div>
          </button>
        </div>

        {/* ── MORE SERVICES ── */}
        <p style={{ color: MUTED, fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.12em", marginBottom: 10 }}>MORE SERVICES</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {extraBtns.map(btn => (
            <button
              key={btn.id}
              onClick={() => handleExtra(btn)}
              style={{
                background: GLASS,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${GLASS_BORDER}`,
                borderRadius: 18,
                padding: "12px 13px",
                display: "flex", alignItems: "center", gap: 10,
                cursor: "pointer", textAlign: "left",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                animation: pressed === btn.id ? "btnPress 0.35s ease" : "none",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 11, background: `${btn.color}12`, border: `1px solid ${btn.color}25`, display: "flex", alignItems: "center", justifyContent: "center", color: btn.color, flexShrink: 0 }}>
                {btn.icon}
              </div>
              <div>
                <p style={{ color: TEXT, fontSize: "0.73rem", fontWeight: 600 }}>{btn.label}</p>
                <p style={{ color: MUTED, fontSize: "0.6rem", marginTop: 2 }}>{btn.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── SUITE AT A GLANCE ── */}
        <div style={{ background: "rgba(255,203,5,0.05)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,203,5,0.16)", borderRadius: 20, padding: "14px 16px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
          <p style={{ color: MAIZE, fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 10 }}>SUITE 402 AT A GLANCE</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[
              { label: "Capacity", value: "12" },
              { label: "Level",    value: "4 North" },
              { label: "Climate",  value: "72 °F" },
            ].map((item, i) => (
              <div key={item.label} style={{ textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.08)" : "none", padding: "0 8px" }}>
                <p style={{ color: TEXT, fontSize: "1rem", fontWeight: 700 }}>{item.value}</p>
                <p style={{ color: MUTED, fontSize: "0.58rem", marginTop: 2, fontWeight: 500 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ height: 8 }} />
      </div>
    </div>
  );
}