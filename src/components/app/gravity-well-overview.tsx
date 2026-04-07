// @ts-nocheck
import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";

/*
 * GRAVITY WELL v3  "Observatory" 
 * 
 * Aesthetic: Deep-space observatory control room. 
 * Not sci-fi clich  think: Dieter Rams designed a telescope interface.
 * 
 * Structure: Full-width carousel with 3 panels that slide with parallax depth.
 * Each panel is a unique composition, not a repeated card.
 * Navigation via bottom track with draggable position indicator.
 * 
 * Fonts: Geist Mono (data), Outfit (headings), Satoshi (body)
 */

//  DESIGN TOKENS 
const T = {
  // Surfaces
  void:     "#08080f",
  deep:     "#121127",
  mid:      "#171732",
  raised:   "#1b1b37",
  glass:    "rgba(255,255,255,0.025)",
  glassHi:  "rgba(255,255,255,0.05)",
  
  // Rules
  rule:     "rgba(200,195,230,0.08)",
  ruleGlow: "rgba(200,195,230,0.16)",
  
  // Text
  t1: "#ededf0",
  t2: "#bbb4d2",
  t3: "#a8a1c3",
  t4: "#8f88ad",
  t5: "#7c74a1",
  
  // Signal
  mint:     "#5fba7d",
  mintDim:  "rgba(95,186,125,0.10)",
  mintGlow: "rgba(95,186,125,0.30)",
  amber:    "#c9a84c",
  amberDim: "rgba(201,168,76,0.10)",
  amberGlow:"rgba(201,168,76,0.25)",
  rose:     "#f28b99",
  roseDim:  "rgba(242,139,153,0.10)",
  roseGlow: "rgba(242,139,153,0.25)",
  violet:   "#b590ff",
  violetDim:"rgba(200,195,230,0.08)",
  violetGlow:"rgba(181,144,255,0.28)",
  sky:      "#ccb5ff",
  skyDim:   "rgba(204,181,255,0.12)",
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_SNAP = "cubic-bezier(0.34, 1.56, 0.64, 1)";

export type RecentActionItem = {
  id: string;
  action: string;
  timestamp: number;
  status: "done" | "failed" | "queued";
  source: "manual" | "hotkey" | "agent";
  context?: string;
};

export function GravityWellOverview({
  insightsContent,
  recentActionLog,
}: {
  insightsContent?: ReactNode;
  recentActionLog?: RecentActionItem[];
}) {
  const [activePanel, setActivePanel] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [dragDelta, setDragDelta] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const panels = ["Activity", "Calendar", "Insights", "Agent", "System"];

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx > panels.length - 1 || idx === activePanel) return;
    setIsTransitioning(true);
    setActivePanel(idx);
    setTimeout(() => setIsTransitioning(false), 600);
  }, [activePanel]);

  // Drag / swipe handlers
  const onPointerDown = (e) => {
    setDragStart(e.clientX);
    setDragDelta(0);
  };
  const onPointerMove = (e) => {
    if (dragStart === null) return;
    setDragDelta(e.clientX - dragStart);
  };
  const onPointerUp = () => {
    if (dragStart === null) return;
    if (Math.abs(dragDelta) > 60) {
      if (dragDelta < 0 && activePanel < panels.length - 1) goTo(activePanel + 1);
      else if (dragDelta > 0 && activePanel > 0) goTo(activePanel - 1);
    }
    setDragStart(null);
    setDragDelta(0);
  };

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") goTo(Math.min(activePanel + 1, panels.length - 1));
      if (e.key === "ArrowLeft") goTo(Math.max(activePanel - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activePanel, goTo, panels.length]);

  const dragOffset = dragStart !== null ? dragDelta * 0.4 : 0;
  const ready = mounted;
  const E = EASE;

  return (
    <div style={{
      background: "transparent",
      minHeight: "auto",
      fontFamily: "'Outfit', 'Satoshi', system-ui, sans-serif",
      color: T.t2,
      WebkitFontSmoothing: "antialiased",
      overflow: "hidden",
      position: "relative",
      userSelect: "none",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Geist+Mono:wght@300;400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        
        @keyframes enterUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes enterScale {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.12); }
        }
                @keyframes pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes pulseR {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes pulseRose {
          0%, 100% { box-shadow: 0 0 4px ${T.roseGlow}; }
          50% { box-shadow: 0 0 12px 2px rgba(242,139,153,0.22); }
        }
        @keyframes pulseMint {
          0%, 100% { box-shadow: 0 0 4px ${T.mintGlow}; }
          50% { box-shadow: 0 0 14px ${T.mintGlow}; }
        }
        @keyframes slideContent {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fillCredits {
          from { width: 0%; }
          to { width: 15.8%; }
        }
        @keyframes trackGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes dotPing {
          0% { transform: scale(1); opacity: 1; }
          75% { transform: scale(2.5); opacity: 0; }
          100% { transform: scale(1); opacity: 0; }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatOrb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(8px, -12px) scale(1.05); }
          66% { transform: translate(-6px, 6px) scale(0.97); }
        }

        .panel-track {
          display: flex;
          transition: transform 0.55s ${EASE};
          will-change: transform;
        }
        
        .panel-item {
          min-width: 100%;
          padding: 0 clamp(24px, 3vw, 44px);
        }
        
        .nav-dot {
          transition: all 0.3s ${EASE};
          cursor: pointer;
          border: none;
          outline: none;
          background: none;
          padding: 8px;
        }
        .nav-dot:hover .dot-inner {
          background: ${T.t2} !important;
          transform: scale(1.3);
        }
        .dot-inner {
          transition: all 0.3s ${EASE};
        }
        
        .row-interactive {
          transition: all 0.15s ${EASE};
          cursor: default;
          border-radius: 8px;
        }
        .row-interactive:hover {
          background: ${T.glassHi};
        }
        .row-interactive:hover .row-time {
          color: ${T.t2} !important;
        }
        .activity-row-interactive {
          border-radius: 16px;
          overflow: hidden;
        }
        .activity-row-interactive:hover {
          border-radius: 16px;
          background: rgba(255,255,255,0.055) !important;
          box-shadow: none;
        }
        
        .conn-row:hover {
          background: ${T.glassHi};
        }
        .conn-row:hover .conn-latency {
          opacity: 1 !important;
        }
        
        .action-btn {
          transition: all 0.2s ${EASE};
          cursor: pointer;
          border: none;
          outline: none;
        }
        .action-btn:hover {
          transform: translateY(-1px);
        }
        .action-btn:active {
          transform: translateY(1px);
        }
        
        .ghost-link {
          transition: color 0.15s ${EASE}, gap 0.15s ${EASE};
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .ghost-link:hover {
          color: ${T.t1} !important;
          gap: 8px;
        }
        
        .queue-item {
          transition: all 0.15s ${EASE};
          border-radius: 6px;
        }
        .queue-item:hover {
          background: ${T.glass};
        }
        
        .tag-chip {
          transition: all 0.15s ${EASE};
        }
        .tag-chip:hover {
          background: ${T.glassHi} !important;
          color: ${T.t2} !important;
          border-color: ${T.ruleGlow} !important;
        }

        .focus-toggle {
          transition: all 0.35s ${EASE};
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .focus-toggle::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.04) 50%, transparent 100%);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .focus-toggle.on::after {
          opacity: 1;
          animation: gradientShift 4s ease-in-out infinite;
        }

        .stat-row {
          transition: all 0.12s ${EASE};
          border-radius: 4px;
          padding: 2px 6px;
          margin: 0 -6px;
        }
        .stat-row:hover {
          background: ${T.glass};
        }
        .activity-scroll {
          max-height: 290px;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: rgba(181,144,255,0.36) transparent;
          padding-left: 4px;
          padding-right: 4px;
        }
        .activity-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .activity-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .activity-scroll::-webkit-scrollbar-thumb {
          background: rgba(181,144,255,0.36);
          border-radius: 999px;
        }
        .action-scroll {
          max-height: 290px;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: rgba(181,144,255,0.36) transparent;
          padding-left: 4px;
          padding-right: 4px;
        }
        .action-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .action-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .action-scroll::-webkit-scrollbar-thumb {
          background: rgba(181,144,255,0.36);
          border-radius: 999px;
        }
        .activity-split {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
          gap: 16px;
        }
        .action-status-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 54px;
          padding: 2px 8px;
          border-radius: 999px;
          font-family: "'Geist Mono', monospace";
          font-size: 9px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border: 1px solid transparent;
        }
        @media (max-width: 980px) {
          .activity-split {
            grid-template-columns: 1fr;
          }
        }
        .hdr-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 10px;
          border-radius: 10px;
          border: 1px solid rgba(200,195,230,0.12);
          background: rgba(255,255,255,0.015);
          min-height: 26px;
          font-family: "'Geist Mono', monospace";
          font-size: 10.5px;
          letter-spacing: 0.01em;
        }
        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>

      {/* Carousel Navigation */}
      <div style={{
        position: "relative", zIndex: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "0",
        marginTop: 10,
        marginBottom: 16,
        animation: mounted ? `enterUp 0.5s ${EASE} 0.1s both` : "none",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 3,
          padding: 3,
          borderRadius: 10,
          border: `1px solid rgba(200,195,230,0.08)`,
          background: "rgba(255,255,255,0.01)",
        }}>
          {panels.map((name, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                background: activePanel === i ? "rgba(255,255,255,0.05)" : "transparent",
                border: `1px solid ${activePanel === i ? "rgba(200,195,230,0.12)" : "transparent"}`,
                outline: "none",
                cursor: "pointer",
                padding: "6px 12px",
                borderRadius: 8,
                color: activePanel === i ? T.t1 : T.t4,
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12.5,
                fontWeight: activePanel === i ? 500 : 400,
                letterSpacing: "0.005em",
                transition: `all 0.2s ${EASE}`,
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/*  CAROUSEL TRACK  */}
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        style={{
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          marginLeft: 0,
          marginRight: 0,
          paddingLeft: 0,
          paddingRight: 0,
          cursor: dragStart !== null ? "grabbing" : "grab",
          animation: mounted ? `enterScale 0.6s ${EASE} 0.15s both` : "none",
        }}
      >
        <div
          className="panel-track"
          style={{
            transform: `translateX(calc(${-activePanel * 100}% + ${dragOffset}px))`,
          }}
        >
          {/*  PANEL 1: ACTIVITY  */}
          <div className="panel-item">
            <ActivityPanel
              focusMode={focusMode}
              active={activePanel === 0}
              mounted={mounted}
              recentActionLog={recentActionLog}
            />
          </div>

          {/*  PANEL 2: INSIGHTS  */}
          <div className="panel-item">
            <CalendarPanel focusMode={focusMode} active={activePanel === 1} mounted={mounted} />
          </div>

          <div className="panel-item">
            {insightsContent ?? (
              <ActivityPanel
                focusMode={focusMode}
                active={activePanel === 2}
                mounted={mounted}
                recentActionLog={recentActionLog}
              />
            )}
          </div>

          {/*  PANEL 3: AGENT  */}
          <div className="panel-item">
            <AgentPanel focusMode={focusMode} active={activePanel === 3} mounted={mounted} />
          </div>

          {/*  PANEL 4: SYSTEM  */}
          <div className="panel-item">
            <SystemPanel focusMode={focusMode} active={activePanel === 4} mounted={mounted} />
          </div>
        </div>
      </div>


      

      {/*  BOTTOM TRACK  scrub indicator  */}
      <div style={{
        position: "relative", zIndex: 2,
        padding: "14px 0 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        animation: mounted ? `enterUp 0.5s ${EASE} 0.3s both` : "none",
      }}>
        {/* Previous */}
        <button onClick={() => goTo(activePanel - 1)} style={{
          background: "none", border: "none", cursor: activePanel > 0 ? "pointer" : "default",
          color: activePanel > 0 ? T.t3 : T.t5, fontSize: 16, padding: "4px 8px",
          transition: `color 0.2s ${EASE}`, fontFamily: "'Outfit', sans-serif",
          opacity: activePanel > 0 ? 1 : 0.3,
        }}>{"<"}</button>

        {/* Track bar */}
        <div style={{
          width: 200,
          height: 3,
          background: T.raised,
          borderRadius: 2,
          position: "relative",
          overflow: "visible",
        }}>
          {/* Fill */}
          <div style={{
            position: "absolute",
            left: 0, top: 0, height: "100%",
            width: `${((activePanel + 1) / panels.length) * 100}%`,
            background: `linear-gradient(90deg, ${T.mint}, ${T.violet}, ${T.sky})`,
            backgroundSize: "300% 100%",
            backgroundPosition: `${activePanel * 50}% 0`,
            borderRadius: 2,
            transition: `all 0.55s ${EASE}`,
          }} />
          {/* Thumb */}
          <div style={{
            position: "absolute",
            top: "50%",
            left: `${((activePanel + 1) / panels.length) * 100}%`,
            transform: "translate(-50%, -50%)",
            width: 11, height: 11,
            borderRadius: "50%",
            background: T.t1,
            border: `2px solid ${T.void}`,
            boxShadow: `0 0 12px ${activePanel === 0 ? T.mintGlow : activePanel === 1 ? T.amberGlow : activePanel === 2 ? T.violetGlow : activePanel === 3 ? T.skyDim : T.roseGlow}`,
            transition: `all 0.55s ${EASE}`,
          }} />
        </div>

        {/* Next */}
        <button onClick={() => goTo(activePanel + 1)} style={{
          background: "none", border: "none", cursor: activePanel < panels.length - 1 ? "pointer" : "default",
          color: activePanel < panels.length - 1 ? T.t3 : T.t5, fontSize: 16, padding: "4px 8px",
          transition: `color 0.2s ${EASE}`, fontFamily: "'Outfit', sans-serif",
          opacity: activePanel < panels.length - 1 ? 1 : 0.3,
        }}>{">"}</button>
      </div>

      {/* Keyboard hint */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        fontFamily: "'Geist Mono', monospace",
        fontSize: 10,
        color: T.t5,
        paddingBottom: 12,
        letterSpacing: "0.06em",
      }}>
        <span>{"<-  -> keys - drag to swipe"}</span>
        <span style={{ opacity: 0.45 }}>|</span>
        <span style={{ letterSpacing: "0.08em" }}>
          {String(activePanel + 1).padStart(2, "0")} / {String(panels.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}


// 
// PANEL 1: ACTIVITY
// 

function CalendarPanel({ focusMode, active, mounted }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [draft, setDraft] = useState("");
  const [filter, setFilter] = useState("all");
  const now = new Date();

  const dayItemsByWeekday = {
    0: [
      { id: "c5", type: "routine", title: "Sunday planning", time: "10:00", priority: "low", linked: "activity" },
    ],
    1: [
      { id: "c1", type: "task", title: "Morning SOL check", time: "08:30", priority: "high", linked: "insights" },
    ],
    3: [
      { id: "c2", type: "event", title: "Risk review", time: "11:00", priority: "med", linked: "activity" },
    ],
    5: [
      { id: "c3", type: "routine", title: "Agent cleanup run", time: "14:30", priority: "low", linked: "agent" },
    ],
    6: [
      { id: "c4", type: "task", title: "Weekly rebalance prep", time: "16:00", priority: "med", linked: "system" },
    ],
  };

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const monthLabel = visibleMonth.toLocaleString("en-US", { month: "long", year: "numeric" });
  const monthStart = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
  const startOffset = monthStart.getDay();
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - startOffset);

  const dayCells = Array.from({ length: 42 }, (_, idx) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + idx);
    const inMonth = date.getMonth() === visibleMonth.getMonth();
    const weekdayItems = dayItemsByWeekday[date.getDay()] || [];
    return {
      date,
      inMonth,
      dots: weekdayItems.slice(0, 3).map((item) => item.type),
    };
  });

  const selectedWeekdayItems = dayItemsByWeekday[selectedDate.getDay()] || [];
  const selectedDayItems = selectedWeekdayItems.map((item, idx) => ({
    ...item,
    id: `${item.id}-${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}-${idx}`,
  }));

  const gotoPrevMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const gotoNextMonth = () => {
    setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const jumpToToday = () => {
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    setSelectedDate(todayStart);
    setVisibleMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  const filteredItems = selectedDayItems.filter((item) => (filter === "all" ? true : item.type === filter));

  const typeColor = (type) =>
    type === "task" ? T.violet : type === "event" ? T.rose : T.mint;

  return (
    <div style={{
      background: T.deep,
      borderRadius: 16,
      border: `1px solid ${T.rule}`,
      padding: "14px 16px",
      minHeight: 400,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 20, right: 20,
        height: 1,
        background: `linear-gradient(90deg, ${T.amber}, transparent 60%)`,
        opacity: 0.35,
      }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 258px", gap: 12 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <h3 style={{
                margin: 0,
                fontFamily: "'Outfit', sans-serif",
                fontSize: 15.5,
                fontWeight: 500,
                color: T.t1,
                letterSpacing: "-0.02em",
              }}>Calendar</h3>
              <p style={{
                margin: "2px 0 0",
                fontFamily: "'Geist Mono', monospace",
                fontSize: 9.5,
                color: T.t4,
              }}>plan  schedule  link actions</p>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                onClick={gotoPrevMonth}
                style={{
                  border: `1px solid ${T.rule}`,
                  background: T.glass,
                  color: T.t3,
                  borderRadius: 8,
                  padding: "3px 8px",
                  fontSize: 11,
                  fontFamily: "'Geist Mono', monospace",
                  cursor: "pointer",
                }}
              >
                {"<"}
              </button>
              <div style={{
                minWidth: 132,
                textAlign: "center",
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10.5,
                color: T.t2,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}>
                {monthLabel}
              </div>
              <button
                onClick={gotoNextMonth}
                style={{
                  border: `1px solid ${T.rule}`,
                  background: T.glass,
                  color: T.t3,
                  borderRadius: 8,
                  padding: "3px 8px",
                  fontSize: 11,
                  fontFamily: "'Geist Mono', monospace",
                  cursor: "pointer",
                }}
              >
                {">"}
              </button>
              <button
                onClick={jumpToToday}
                style={{
                  border: `1px solid ${T.rule}`,
                  background: T.glassHi,
                  color: T.t2,
                  borderRadius: 8,
                  padding: "3px 8px",
                  fontSize: 9.5,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontFamily: "'Geist Mono', monospace",
                  cursor: "pointer",
                }}
              >
                Today
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0,1fr))", gap: 6 }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dow) => (
              <div key={dow} style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 9,
                color: T.t5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                textAlign: "center",
                paddingBottom: 1,
              }}>{dow}</div>
            ))}
            {dayCells.map((cell) => {
              const isSelected = isSameDay(cell.date, selectedDate);
              const isToday = isSameDay(cell.date, now);
              return (
                <button
                  key={cell.date.toISOString()}
                  onClick={() => setSelectedDate(cell.date)}
                  style={{
                    minHeight: 42,
                    borderRadius: 8,
                    border: `1px solid ${isSelected ? "rgba(133,21,214,0.4)" : isToday ? "rgba(95,186,125,0.28)" : T.rule}`,
                    background: isSelected ? "rgba(133,21,214,0.12)" : T.glass,
                    color: cell.inMonth ? T.t1 : T.t5,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4,
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 500, fontFamily: "'Outfit', sans-serif", lineHeight: 1 }}>{cell.date.getDate()}</span>
                  <span style={{ display: "flex", gap: 3 }}>
                    {cell.dots.slice(0, 3).map((t, i) => (
                      <i key={i} style={{
                        width: 3, height: 3, borderRadius: "50%",
                        background: typeColor(t), display: "inline-block",
                      }} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <aside style={{
          background: T.glass,
          border: `1px solid ${T.rule}`,
          borderRadius: 12,
          padding: "10px 10px 8px",
          minHeight: 0,
        }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11.5, color: T.t1, fontWeight: 500 }}>
              {selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
            </div>
            <div style={{ fontSize: 9.5, color: T.t4, fontFamily: "'Geist Mono', monospace" }}>SOL snapshot: $148.32 (+2.4%)</div>
          </div>

          <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
            {["all", "task", "event", "routine"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  border: `1px solid ${filter === f ? T.ruleGlow : "transparent"}`,
                  background: filter === f ? T.glassHi : "transparent",
                  color: filter === f ? T.t1 : T.t4,
                  borderRadius: 999,
                  padding: "2px 7px",
                  fontSize: 9,
                  fontFamily: "'Geist Mono', monospace",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 6, marginBottom: 8 }}>
            {filteredItems.map((item) => (
              <div key={item.id} style={{
                border: `1px solid ${T.rule}`,
                borderRadius: 8,
                background: "rgba(255,255,255,0.015)",
                padding: "6px 7px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{ fontSize: 10.5, color: T.t1 }}>{item.title}</span>
                  <span style={{ fontSize: 9, color: T.t4, fontFamily: "'Geist Mono', monospace" }}>{item.time}</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <span style={{
                    fontSize: 8.5, padding: "2px 5px", borderRadius: 999,
                    background: T.glassHi, color: T.t3, border: `1px solid ${T.rule}`,
                    textTransform: "uppercase", fontFamily: "'Geist Mono', monospace",
                  }}>{item.type}</span>
                  <span style={{
                    fontSize: 8.5, padding: "2px 5px", borderRadius: 999,
                    background: T.glassHi, color: T.amber, border: `1px solid rgba(201,168,76,0.2)`,
                    textTransform: "uppercase", fontFamily: "'Geist Mono', monospace",
                  }}>{item.priority}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: `1px solid ${T.rule}`,
            paddingTop: 8,
            display: "grid",
            gap: 5,
          }}>
            <div style={{ fontSize: 9.5, color: T.t4, fontFamily: "'Geist Mono', monospace", textTransform: "uppercase" }}>Quick add</div>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add task/event..."
              style={{
                height: 28,
                borderRadius: 8,
                border: `1px solid ${T.rule}`,
                background: "rgba(255,255,255,0.02)",
                color: T.t2,
                padding: "0 10px",
                outline: "none",
                fontSize: 11,
              }}
            />
            <button style={{
              height: 26,
              borderRadius: 8,
              border: `1px solid rgba(133,21,214,0.35)`,
              background: "rgba(133,21,214,0.14)",
              color: T.violet,
              fontSize: 10.5,
              cursor: "pointer",
              fontWeight: 500,
            }}>Create</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
function ActivityPanel({ focusMode, active, mounted, recentActionLog }) {
  const [filter, setFilter] = useState("all");
  const [hovered, setHovered] = useState(null);
  const [actionFilter, setActionFilter] = useState("all");

  const activities = [
    { id: 1, label: "Firedancer mainnet timeline analysis", sub: "Research", meta: "1,240 words", ago: "12m", category: "research", needsAction: false, fresh: true },
    { id: 2, label: "SOL long - breakout confirmation", sub: "Trade journal", meta: "entry logged", ago: "2h", category: "trade", needsAction: false, fresh: false },
    { id: 3, label: "Exit JTO short if TVL recovers above $820M", sub: "Decision log", meta: "conditional", ago: "5h", category: "decision", needsAction: true, fresh: false },
    { id: 4, label: "AI auto-tagged 3 notes - linked 2 decisions", sub: "System action", meta: "agent", ago: "6h", category: "ai", needsAction: false, fresh: false },
    { id: 5, label: "Validator economics deep-dive draft", sub: "Dev notes", meta: "890 words", ago: "1d", category: "research", needsAction: false, fresh: false },
  ];

  const filtered = activities.filter((a) => {
    if (focusMode && !a.needsAction) return false;
    if (filter === "all") return true;
    return a.category === filter;
  });

  const filters = ["all", "trade", "decision", "research", "ai"];

  const fallbackActions = [
    { id: "a1", action: "Capture note", timestamp: Date.now() - 3 * 60 * 1000, status: "done", source: "hotkey", context: "manual entry" },
    { id: "a2", action: "Set price alert", timestamp: Date.now() - 12 * 60 * 1000, status: "done", source: "manual", context: "SOL > 188" },
    { id: "a3", action: "Open agent", timestamp: Date.now() - 36 * 60 * 1000, status: "queued", source: "manual", context: "cleanup + tagging" },
    { id: "a4", action: "Import statement", timestamp: Date.now() - 2 * 60 * 60 * 1000, status: "failed", source: "manual", context: "format mismatch" },
    { id: "a5", action: "Export weekly report", timestamp: Date.now() - 5 * 60 * 60 * 1000, status: "done", source: "agent", context: "PDF export" },
  ];

  const actionFeed = (recentActionLog && recentActionLog.length > 0 ? recentActionLog : fallbackActions)
    .slice()
    .sort((a, b) => b.timestamp - a.timestamp);

  const filteredActionFeed = actionFeed.filter((entry) => (actionFilter === "all" ? true : entry.status === actionFilter));

  const formatAgo = (timestamp) => {
    const diff = Math.max(0, Date.now() - timestamp);
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
  };

  return (
    <div style={{
      background: T.deep,
      borderRadius: 16,
      border: `1px solid ${T.rule}`,
      padding: "20px 24px",
      minHeight: 380,
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 24, right: 24,
        height: 1,
        background: `linear-gradient(90deg, ${T.mint}, transparent 60%)`,
        opacity: 0.4,
      }} />

      <div className="activity-split">
        <div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}>
            <div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 17,
                fontWeight: 500,
                color: T.t1,
                margin: 0,
                letterSpacing: "-0.02em",
              }}>Recent Activity</h3>
              <p style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10.5,
                color: T.t4,
                margin: "4px 0 0",
                letterSpacing: "0.02em",
              }}>
                {filtered.length} items - {focusMode ? "actions only" : "all types"}
              </p>
            </div>
            <span className="ghost-link" style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              color: T.t4,
            }}>
              view all <span style={{ fontSize: 13 }}>-&gt;</span>
            </span>
          </div>

          <div style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
            flexWrap: "wrap",
          }}>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? T.glassHi : "transparent",
                  border: `1px solid ${filter === f ? T.ruleGlow : "transparent"}`,
                  color: filter === f ? T.t1 : T.t4,
                  padding: "4px 14px",
                  borderRadius: 20,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11.5,
                  fontWeight: filter === f ? 500 : 400,
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: `all 0.2s ${EASE}`,
                  letterSpacing: "0.01em",
                }}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="activity-scroll">
            {filtered.map((a, i) => (
              <div
                key={a.id}
                className="row-interactive activity-row-interactive"
                onMouseEnter={() => setHovered(a.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "11px 10px",
                  animation: active ? `slideContent 0.4s ${EASE} ${i * 0.07}s both` : "none",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13.5,
                    color: a.fresh ? T.t1 : a.needsAction ? T.t1 : T.t2,
                    fontWeight: a.fresh ? 500 : 400,
                    lineHeight: 1.4,
                    letterSpacing: "-0.005em",
                    fontFamily: "'Outfit', sans-serif",
                  }}>
                    {a.label}
                    {a.needsAction && (
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        marginLeft: 8,
                        padding: "1px 8px",
                        borderRadius: 10,
                        background: T.amberDim,
                        border: "1px solid rgba(251,191,36,0.15)",
                        fontSize: 9.5,
                        fontWeight: 600,
                        color: T.amber,
                        fontFamily: "'Geist Mono', monospace",
                        letterSpacing: "0.06em",
                        verticalAlign: "middle",
                      }}>ACTION</span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 11.5,
                    color: T.t4,
                    marginTop: 3,
                    fontFamily: "'Geist Mono', monospace",
                    display: "flex",
                    gap: 6,
                  }}>
                    <span>{a.sub}</span>
                    <span style={{ color: T.t5 }}>-</span>
                    <span>{a.meta}</span>
                  </div>
                </div>
                <div className="row-time" style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  color: T.t5,
                  fontVariantNumeric: "tabular-nums",
                  paddingTop: 2,
                  transition: `color 0.15s ${EASE}`,
                }}>{a.ago}</div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "48px 0",
                color: T.t5,
                fontStyle: "italic",
                fontSize: 13,
              }}>
                Nothing needs attention right now
              </div>
            )}
          </div>
        </div>

        <div style={{
          borderLeft: `1px solid ${T.rule}`,
          paddingLeft: 14,
          minWidth: 0,
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}>
            <div>
              <h3 style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 17,
                fontWeight: 500,
                color: T.t1,
                margin: 0,
                letterSpacing: "-0.02em",
              }}>Recent Actions</h3>
              <p style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10.5,
                color: T.t4,
                margin: "4px 0 0",
                letterSpacing: "0.02em",
              }}>
                behavior memory stream
              </p>
            </div>
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 10.5,
              color: T.t5,
            }}>{filteredActionFeed.length} logs</span>
          </div>

          <div style={{
            display: "flex",
            gap: 6,
            marginBottom: 16,
            flexWrap: "wrap",
          }}>
            {["all", "done", "queued", "failed"].map((status) => (
              <button
                key={status}
                onClick={() => setActionFilter(status)}
                style={{
                  background: actionFilter === status ? T.glassHi : "transparent",
                  border: `1px solid ${actionFilter === status ? T.ruleGlow : "transparent"}`,
                  color: actionFilter === status ? T.t1 : T.t4,
                  padding: "4px 14px",
                  borderRadius: 20,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11.5,
                  fontWeight: actionFilter === status ? 500 : 400,
                  letterSpacing: "0.01em",
                  textTransform: "capitalize",
                  cursor: "pointer",
                  transition: `all 0.2s ${EASE}`,
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="action-scroll">
            {filteredActionFeed.map((entry, i) => {
              const statusStyle = entry.status === "done"
                ? { color: T.mint, borderColor: "rgba(95,186,125,0.22)", background: T.mintDim }
                : entry.status === "failed"
                  ? { color: T.rose, borderColor: "rgba(242,139,153,0.22)", background: T.roseDim }
                  : { color: T.amber, borderColor: "rgba(201,168,76,0.25)", background: T.amberDim };

              return (
                <div
                  key={entry.id}
                  className="row-interactive"
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 10px",
                    borderRadius: 16,
                    minHeight: 58,
                    animation: active ? `slideContent 0.4s ${EASE} ${i * 0.05}s both` : "none",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      minWidth: 0,
                    }}>
                      <span style={{
                        fontSize: 13.5,
                        color: T.t2,
                        fontFamily: "'Outfit', sans-serif",
                        fontWeight: 500,
                        lineHeight: 1.4,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>{entry.action}</span>
                      <span className="action-status-pill" style={statusStyle}>{entry.status}</span>
                    </div>
                    <div style={{
                      marginTop: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: 11.5,
                      color: T.t4,
                    }}>
                      <span>{formatAgo(entry.timestamp)}</span>
                      <span>-</span>
                      <span>{entry.source}</span>
                      {entry.context ? (
                        <>
                          <span>-</span>
                          <span style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 140,
                          }}>{entry.context}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredActionFeed.length === 0 && (
              <div style={{
                textAlign: "center",
                padding: "48px 0",
                color: T.t5,
                fontStyle: "italic",
                fontSize: 12,
              }}>
                No matching actions yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 
// PANEL 2: AGENT
// 

function AgentPanel({ focusMode, active, mounted }) {
  return <AgentCommandCenterPanel />;
}
//  TOKENS 
const AGENT_C = {
  bg: T.void, panel: T.deep, raised: T.mid, elevated: T.raised,
  glass: T.glass, glassHi: T.glassHi,
  border: T.rule, borderLit: T.ruleGlow,
  t1: T.t1, t2: T.t2, t3: T.t3, t4: T.t4, t5: T.t5,
  mint: T.mint, mintD: T.mintDim, mintG: T.mintGlow,
  violet: T.violet, violetD: T.violetDim, violetG: T.violetGlow,
  amber: T.amber, amberD: T.amberDim, amberG: T.amberGlow,
  rose: T.rose, roseD: T.roseDim, roseG: T.roseGlow,
  sky: T.sky, skyD: T.skyDim,
  lime: T.mint, limeD: T.mintDim,
};
const AGENT_E = "cubic-bezier(0.22,1,0.36,1)";

//  SECTION AGENT_TABS 
const AGENT_TABS = [
  { id: "mission", label: "Mission", icon: "M" },
  { id: "live", label: "Live Run", icon: "L" },
  { id: "queue", label: "Queue", icon: "Q" },
  { id: "quality", label: "Quality", icon: "Q" },
  { id: "memory", label: "Memory", icon: "M" },
  { id: "auto", label: "Automation", icon: "A" },
  { id: "incident", label: "Incidents", icon: "!" },
  { id: "metrics", label: "Metrics", icon: "T" },
  { id: "audit", label: "Audit", icon: "A" },
];

function AgentCommandCenterPanel() {
  const [tab, setTab] = useState("mission");
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 60) }, []);

  return (
    <div style={{
      background: "transparent", minHeight: "auto", fontFamily: "'Outfit',system-ui,sans-serif", color: AGENT_C.t2, WebkitFontSmoothing: "antialiased", padding: 0,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700&family=Geist+Mono:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideR{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        @keyframes pulse{0%,100%{box-shadow:0 0 4px ${AGENT_C.mintG}}50%{box-shadow:0 0 14px ${AGENT_C.mintG}}}
        @keyframes pulseR{0%,100%{box-shadow:0 0 0 transparent}50%{box-shadow:0 0 10px ${AGENT_C.roseG}}}
        @keyframes progress{from{width:0%}to{width:58%}}
        @keyframes breathe{0%,100%{opacity:.25;transform:scale(1)}50%{opacity:.6;transform:scale(1.08)}}
        @keyframes barFill{from{width:0%}}

        .tab-btn{
          background:none;border:none;outline:none;cursor:pointer;
          padding:7px 12px;border-radius:8px;
          font-family:'Outfit';font-size:12px;font-weight:400;
          color:${AGENT_C.t4};transition:all .18s ${AGENT_E};
          display:flex;align-items:center;gap:6px;white-space:nowrap;
        }
        .tab-btn:hover{color:${AGENT_C.t2};background:${AGENT_C.glass}}
        .tab-btn.on{color:${AGENT_C.t1};background:${AGENT_C.glassHi};font-weight:500;border:1px solid ${AGENT_C.border}}

        .row{transition:background .12s ${AGENT_E};border-radius:6px;cursor:default}
        .row:hover{background:${AGENT_C.glassHi}}
        .row:hover .row-meta{color:${AGENT_C.t2} !important}

        .btn-sm{
          padding:3px 10px;border-radius:6px;border:1px solid ${AGENT_C.border};
          background:${AGENT_C.glass};color:${AGENT_C.t3};font-size:10px;font-family:'Geist Mono',monospace;
          cursor:pointer;transition:all .15s ${AGENT_E};font-weight:400;letter-spacing:.02em;
        }
        .btn-sm:hover{background:${AGENT_C.glassHi};color:${AGENT_C.t1};border-color:${AGENT_C.borderLit}}

        .btn-action{
          padding:4px 14px;border-radius:8px;border:none;
          font-family:'Outfit';font-size:11.5px;font-weight:500;
          cursor:pointer;transition:all .18s ${AGENT_E};
        }
        .btn-action:hover{transform:translateY(-1px)}
        .btn-action:active{transform:translateY(1px)}

        .metric-card{
          padding:14px 16px;border-radius:12px;
          background:${AGENT_C.glass};border:1px solid ${AGENT_C.border};
          transition:all .15s ${AGENT_E};
        }
        .metric-card:hover{border-color:${AGENT_C.borderLit};background:${AGENT_C.glassHi}}

        .badge{
          display:inline-flex;align-items:center;gap:4px;
          padding:2px 10px;border-radius:10px;
          font-family:'Geist Mono',monospace;font-size:10px;font-weight:500;
        }

        .chip{
          padding:4px 12px;border-radius:16px;border:1px solid ${AGENT_C.border};
          background:${AGENT_C.glass};font-family:'Geist Mono',monospace;
          font-size:10px;color:${AGENT_C.t3};cursor:pointer;transition:all .15s ${AGENT_E};
        }
        .chip:hover{border-color:${AGENT_C.borderLit};color:${AGENT_C.t2};background:${AGENT_C.glassHi}}
        .chip.on{border-color:${AGENT_C.borderLit};color:${AGENT_C.t1};background:${AGENT_C.glassHi}}

        .toggle-track{
          width:32px;height:16px;border-radius:8px;background:${AGENT_C.t5};
          position:relative;cursor:pointer;transition:background .2s ${AGENT_E};
        }
        .toggle-track.on{background:${AGENT_C.mint}}
        .toggle-thumb{
          position:absolute;top:2px;width:12px;height:12px;border-radius:50%;
          background:${AGENT_C.t1};transition:left .2s ${AGENT_E};
        }

        .conf-bar{height:4px;border-radius:2px;background:${AGENT_C.elevated};overflow:hidden}
        .conf-fill{height:100%;border-radius:2px;transition:width .4s ${AGENT_E}}

        .link-line{
          stroke:${AGENT_C.violet};stroke-width:1.5;opacity:.3;
          stroke-dasharray:4 3;
        }

        .ghost{
          color:${AGENT_C.t4};cursor:pointer;display:inline-flex;
          align-items:center;gap:4px;transition:color .15s ${AGENT_E},gap .15s ${AGENT_E};
          font-family:'Geist Mono',monospace;font-size:10.5px;
        }
        .ghost:hover{color:${AGENT_C.t1};gap:7px}

        .section-label{
          font-family:'Geist Mono',monospace;font-size:9.5px;
          letter-spacing:.1em;color:${AGENT_C.t4};font-weight:500;
          text-transform:uppercase;margin-bottom:10px;
        }
        .agent-zone-scroll {
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0;
          overscroll-behavior: contain;
          scrollbar-width: thin;
          scrollbar-color: rgba(181,144,255,0.36) transparent;
        }
        .agent-zone-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .agent-zone-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .agent-zone-scroll::-webkit-scrollbar-thumb {
          background: rgba(181,144,255,0.36);
          border-radius: 999px;
        }
      `}</style>

      {/*  MAIN CONTAINER  */}
      <div style={{
        background: AGENT_C.panel,
        borderRadius: 16,
        border: `1px solid ${AGENT_C.border}`,
        overflow: "hidden",
        minHeight: 460,
        height: 460,
        display: "flex",
        flexDirection: "column",
        animation: ready ? `fadeIn .5s ${AGENT_E} both` : "none",
      }}>
                {/* HEADER BAR */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px",
          borderBottom: `1px solid ${AGENT_C.border}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 500, color: AGENT_C.t1, letterSpacing: "-0.01em" }}>SecondBrain Agent</span>
              <span className="badge" style={{ background: AGENT_C.mintD, color: AGENT_C.mint, border: `1px solid rgba(94,234,212,0.15)`, padding: "1px 8px" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: AGENT_C.mint, animation: "pulse 2s ease-in-out infinite" }} />
                ACTIVE
              </span>
            </div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9.5, color: AGENT_C.t4, marginTop: 2 }}>
              v0.4.2 - default config - 7/hr throughput - last run 12m ago
            </div>
          </div>

          <span className="ghost" style={{ fontSize: 11 }}>
            panel <span style={{ fontSize: 13 }}></span>
          </span>
        </div>

        {/* TAB NAVIGATION */}
        <div style={{
          display: "flex", gap: 2, padding: "8px 18px",
          borderBottom: `1px solid ${AGENT_C.border}`,
          overflowX: "auto",
        }}>
          {AGENT_TABS.map(t => (
            <button key={t.id} className={`tab-btn ${tab === t.id ? "on" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span style={{ fontSize: 11, opacity: tab === t.id ? 1 : 0.5 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/*  CONTENT  */}
        <div className="agent-zone-scroll" style={{ padding: "18px 22px", flex: 1 }}>
          {tab === "mission" && <MissionTab />}
          {tab === "live" && <LiveRunTab />}
          {tab === "queue" && <QueueTab />}
          {tab === "quality" && <QualityTab />}
          {tab === "memory" && <MemoryTab />}
          {tab === "auto" && <AutomationTab />}
          {tab === "incident" && <IncidentTab />}
          {tab === "metrics" && <MetricsTab />}
          {tab === "audit" && <AuditTab />}
        </div>
      </div>
    </div>
  );
}

// 
// 1. MISSION & MODE
// 
function MissionTab() {
  const [mode, setMode] = useState("balanced");
  const [scope, setScope] = useState("all");
  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      {/* Objective */}
      <div style={{ marginBottom: 22 }}>
        <div className="section-label">Weekly Objective</div>
        <div style={{
          padding: "14px 18px", borderRadius: 12,
          background: AGENT_C.glass, border: `1px solid ${AGENT_C.border}`,
        }}>
          <div style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 500, color: AGENT_C.t1, marginBottom: 6, letterSpacing: "-0.01em" }}>
            Link all Solana ecosystem notes to trade decisions + tag for weekly digest
          </div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10.5, color: AGENT_C.t4 }}>
            Set Mon 9:00  4d remaining  62% complete
          </div>
          <div style={{ marginTop: 10, height: 4, borderRadius: 2, background: AGENT_C.elevated, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "62%", borderRadius: 2, background: `linear-gradient(90deg,${AGENT_C.violet},${AGENT_C.sky})`, animation: `barFill .8s ${AGENT_E} both` }} />
          </div>
        </div>
      </div>

      {/* Mode + Scope */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div className="section-label">Agent Mode</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["conservative", "balanced", "aggressive"].map(m => (
              <button key={m} className={`chip ${mode === m ? "on" : ""}`}
                onClick={() => setMode(m)}
                style={{
                  flex: 1, textAlign: "center", textTransform: "capitalize",
                  ...(mode === m && m === "aggressive" ? { borderColor: "rgba(251,113,133,0.2)", color: AGENT_C.rose, background: AGENT_C.roseD } : {}),
                  ...(mode === m && m === "conservative" ? { borderColor: "rgba(94,234,212,0.2)", color: AGENT_C.mint, background: AGENT_C.mintD } : {}),
                  ...(mode === m && m === "balanced" ? { borderColor: "rgba(167,139,250,0.2)", color: AGENT_C.violet, background: AGENT_C.violetD } : {}),
                }}
              >{m}</button>
            ))}
          </div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t5, marginTop: 8, lineHeight: 1.5 }}>
            {mode === "conservative" && "Manual approval required for all changes. No auto-linking."}
            {mode === "balanced" && "Auto-tag and link with >80% confidence. Flag rest for review."}
            {mode === "aggressive" && "Auto-apply all suggestions. Higher throughput, less oversight."}
          </div>
        </div>
        <div>
          <div className="section-label">Scope</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[{ k: "notes", l: "Notes" }, { k: "trades", l: "Trades" }, { k: "all", l: "All" }].map(s => (
              <button key={s.k} className={`chip ${scope === s.k ? "on" : ""}`}
                onClick={() => setScope(s.k)} style={{ flex: 1, textAlign: "center" }}
              >{s.l}</button>
            ))}
          </div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t5, marginTop: 8 }}>
            Pipelines: {scope === "all" ? "Tagging, Linking, Cleanup, Summaries" : scope === "notes" ? "Tagging, Cleanup, Summaries" : "Linking, Trade analysis"}
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 20 }}>
        {[
          { label: "Processed today", value: "23", color: AGENT_C.mint },
          { label: "Pending review", value: "4", color: AGENT_C.amber },
          { label: "Auto-approved", value: "19", color: AGENT_C.violet },
          { label: "Errors", value: "1", color: AGENT_C.rose },
        ].map((s, i) => (
          <div key={i} className="metric-card" style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 300, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9.5, color: AGENT_C.t4, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 
// 2. LIVE RUN STATE
// 
function LiveRunTab() {
  const [progress, setProgress] = useState(58);
  useEffect(() => {
    const i = setInterval(() => setProgress(p => p < 95 ? p + 1 : p), 2000);
    return () => clearInterval(i);
  }, []);
  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      {/* Current job */}
      <div style={{
        padding: "16px 20px", borderRadius: 12,
        background: AGENT_C.glass, border: `1px solid ${AGENT_C.border}`, marginBottom: 18,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="badge" style={{ background: AGENT_C.mintD, color: AGENT_C.mint, border: `1px solid rgba(94,234,212,0.12)` }}>RUNNING</span>
              <span style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 500, color: AGENT_C.t1 }}>Linking notes to trade decisions</span>
            </div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10.5, color: AGENT_C.t4, marginTop: 4 }}>
              Processing note 7 of 12  "Firedancer mainnet analysis"  Trade: SOL long
            </div>
          </div>
          <button className="btn-sm" style={{ color: AGENT_C.rose, borderColor: "rgba(251,113,133,0.15)" }}>Cancel</button>
        </div>
        {/* Progress */}
        <div style={{ height: 6, borderRadius: 3, background: AGENT_C.elevated, overflow: "hidden", marginBottom: 8 }}>
          <div style={{
            height: "100%", width: `${progress}%`, borderRadius: 3,
            background: `linear-gradient(90deg,${AGENT_C.mint},${AGENT_C.sky})`,
            transition: `width .5s ${AGENT_E}`,
            boxShadow: `0 0 12px ${AGENT_C.mintG}`,
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t4 }}>
          <span>{progress}%  ETA 3m 20s</span>
          <span>Queue time: 1m 45s  Throughput: 7.2 jobs/hr</span>
        </div>
      </div>

      {/* Run stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
        {[
          { label: "Last successful", value: "12m ago", sub: "Linking: 12/12 notes", color: AGENT_C.mint },
          { label: "Last failed", value: "2h ago", sub: "Cleanup: timeout on draft #4", color: AGENT_C.rose },
          { label: "Avg duration", value: "4m 12s", sub: "Per job  past 24h", color: AGENT_C.t2 },
        ].map((s, i) => (
          <div key={i} className="metric-card">
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9.5, color: AGENT_C.t4, marginBottom: 4, letterSpacing: ".06em", textTransform: "uppercase" }}>{s.label}</div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 400, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t5, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Up next */}
      <div className="section-label">Up Next in Queue</div>
      {["Tagging: 'Validator economics draft'", "Cleanup: Format SOL breakout entry", "Summary: Generate daily digest"].map((item, i) => (
        <div key={i} className="row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 10px", margin: "0 -10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t5, width: 16 }}>{i + 1}</span>
            <span style={{ fontSize: 12.5, color: AGENT_C.t2 }}>{item}</span>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn-sm">Skip</button>
            <button className="btn-sm"></button>
          </div>
        </div>
      ))}
    </div>
  );
}

// 
// 3. ACTIONABLE QUEUE
// 
function QueueTab() {
  const [items, setItems] = useState([
    { id: 1, label: "Tagging: 'SOL breakout confirmation'", status: "pending", priority: "normal", deps: null },
    { id: 2, label: "Linking: 'JTO exit decision'", status: "pending", priority: "high", deps: null },
    { id: 3, label: "Cleanup: 'validator economics' draft", status: "blocked", priority: "normal", deps: "Waiting on tag model v2.1 to complete indexing (ETA: 5m)" },
    { id: 4, label: "Summary: Weekly digest generation", status: "pending", priority: "low", deps: "Requires all linking jobs to complete first" },
  ]);
  const statusColor = { pending: AGENT_C.amber, blocked: AGENT_C.rose, running: AGENT_C.mint };
  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "'Outfit'", fontSize: 15, fontWeight: 500, color: AGENT_C.t1 }}>{items.length} items</span>
          <span className="badge" style={{ background: AGENT_C.amberD, color: AGENT_C.amber, border: `1px solid rgba(251,191,36,0.12)` }}>
            {items.filter(i => i.status === "pending").length} pending
          </span>
          <span className="badge" style={{ background: AGENT_C.roseD, color: AGENT_C.rose, border: `1px solid rgba(251,113,133,0.1)` }}>
            {items.filter(i => i.status === "blocked").length} blocked
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn-action" style={{ background: AGENT_C.violetD, color: AGENT_C.violet, border: `1px solid rgba(167,139,250,0.12)` }}>Run all</button>
          <button className="btn-action" style={{ background: AGENT_C.glass, color: AGENT_C.t3, border: `1px solid ${AGENT_C.border}` }}>Clear completed</button>
        </div>
      </div>

      {items.map((item, i) => (
        <div key={item.id} className="row" style={{
          padding: "12px 14px", margin: "0 -14px 4px", display: "flex", flexDirection: "column", gap: 8,
          animation: `slideR .3s ${AGENT_E} ${i * .05}s both`,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor[item.status], boxShadow: `0 0 6px ${statusColor[item.status]}40`, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: item.status === "blocked" ? AGENT_C.rose : AGENT_C.t1, fontWeight: item.priority === "high" ? 500 : 400 }}>{item.label}</span>
              {item.priority === "high" && <span className="badge" style={{ background: AGENT_C.amberD, color: AGENT_C.amber, fontSize: 9, border: `1px solid rgba(251,191,36,0.1)` }}>HIGH</span>}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button className="btn-sm">Retry</button>
              <button className="btn-sm">Skip</button>
              <button className="btn-sm"> Priority</button>
              <button className="btn-sm">Open</button>
            </div>
          </div>
          {item.deps && (
            <div style={{
              marginLeft: 16, padding: "6px 12px", borderRadius: 8,
              background: item.status === "blocked" ? AGENT_C.roseD : AGENT_C.glass,
              border: `1px solid ${item.status === "blocked" ? "rgba(251,113,133,0.08)" : AGENT_C.border}`,
              fontFamily: "'Geist Mono',monospace", fontSize: 10.5,
              color: item.status === "blocked" ? "#fda4af" : AGENT_C.t3,
            }}>
              {item.deps}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// 
// 4. QUALITY & CONFIDENCE
// 
function QualityTab() {
  const [reviews, setReviews] = useState([
    { id: 1, action: "Tagged 'Firedancer analysis' as #solana #infrastructure", conf: 94, status: null },
    { id: 2, action: "Linked 'JTO exit'  'TVL thesis note'", conf: 72, status: null },
    { id: 3, action: "Auto-summarized validator economics (890120 words)", conf: 61, status: null },
    { id: 4, action: "Tagged 'SOL breakout' as #momentum #long", conf: 88, status: null },
  ]);
  const confColor = (c) => c >= 85 ? AGENT_C.mint : c >= 70 ? AGENT_C.amber : AGENT_C.rose;
  const approve = (id) => setReviews(r => r.map(x => x.id === id ? { ...x, status: "approved" } : x));
  const reject = (id) => setReviews(r => r.map(x => x.id === id ? { ...x, status: "rejected" } : x));

  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      {/* Drift alert */}
      <div style={{
        padding: "12px 16px", borderRadius: 10, marginBottom: 16,
        background: AGENT_C.amberD, border: `1px solid rgba(251,191,36,0.12)`,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <span style={{ fontSize: 14 }}></span>
        <div>
          <div style={{ fontSize: 12.5, color: AGENT_C.amber, fontWeight: 500 }}>Tag quality drift detected</div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10.5, color: AGENT_C.t3, marginTop: 2 }}>
            Accuracy dropped 12% week-over-week on #infrastructure tags. Consider retraining or switching to manual review.
          </div>
        </div>
        <button className="btn-sm" style={{ marginLeft: "auto", flexShrink: 0 }}>Review</button>
      </div>

      <div className="section-label">Needs Review  {reviews.filter(r => !r.status).length} pending</div>
      {reviews.map((r, i) => (
        <div key={r.id} className="row" style={{
          padding: "10px 14px", margin: "0 -14px 2px",
          display: "flex", alignItems: "center", gap: 12,
          opacity: r.status ? 0.4 : 1, transition: `opacity .3s ${AGENT_E}`,
          animation: `slideR .3s ${AGENT_E} ${i * .04}s both`,
        }}>
          {/* Confidence bar */}
          <div style={{ width: 48, flexShrink: 0 }}>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, fontWeight: 500, color: confColor(r.conf), marginBottom: 3 }}>{r.conf}%</div>
            <div className="conf-bar">
              <div className="conf-fill" style={{ width: `${r.conf}%`, background: confColor(r.conf) }} />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, color: AGENT_C.t1 }}>{r.action}</div>
          </div>
          {!r.status ? (
            <div style={{ display: "flex", gap: 4 }}>
              <button className="btn-action" onClick={() => approve(r.id)} style={{ background: AGENT_C.mintD, color: AGENT_C.mint, border: `1px solid rgba(94,234,212,0.1)`, fontSize: 10.5 }}> Approve</button>
              <button className="btn-action" onClick={() => reject(r.id)} style={{ background: AGENT_C.roseD, color: AGENT_C.rose, border: `1px solid rgba(251,113,133,0.08)`, fontSize: 10.5 }}> Reject</button>
            </div>
          ) : (
            <span className="badge" style={{
              background: r.status === "approved" ? AGENT_C.mintD : AGENT_C.roseD,
              color: r.status === "approved" ? AGENT_C.mint : AGENT_C.rose,
              border: `1px solid ${r.status === "approved" ? "rgba(94,234,212,0.12)" : "rgba(251,113,133,0.1)"}`,
            }}>{r.status === "approved" ? " Approved" : " Rejected"}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// 
// 5. MEMORY GRAPH
// 
function MemoryTab() {
  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      {/* New links */}
      <div className="section-label">New Links Created (last 24h)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 20 }}>
        {[
          { from: "Firedancer mainnet analysis", to: "SOL long  breakout", type: "note  trade", conf: 92 },
          { from: "Validator economics draft", to: "Infrastructure thesis", type: "note  note", conf: 78 },
          { from: "Exit JTO short", to: "TVL recovery thesis", type: "decision  note", conf: 85 },
        ].map((link, i) => (
          <div key={i} className="row" style={{ padding: "10px 14px", margin: "0 -14px", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12.5, color: AGENT_C.t1 }}>
                <span>{link.from}</span>
                <span style={{ color: AGENT_C.violet, margin: "0 8px", fontSize: 11, fontFamily: "'Geist Mono',monospace" }}></span>
                <span>{link.to}</span>
              </div>
              <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t4, marginTop: 2 }}>{link.type}  {link.conf}% confidence</div>
            </div>
            <button className="btn-sm">View</button>
          </div>
        ))}
      </div>

      {/* Detections */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div className="section-label"> Contradictions</div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: AGENT_C.amberD, border: `1px solid rgba(251,191,36,0.1)` }}>
            <div style={{ fontSize: 12, color: AGENT_C.amber, fontWeight: 500, marginBottom: 4 }}>"Exit JTO short" conflicts with "JTO accumulation thesis"</div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t3 }}>Decision from 5h ago contradicts note from 3d ago</div>
            <button className="btn-sm" style={{ marginTop: 8 }}>Resolve</button>
          </div>
        </div>
        <div>
          <div className="section-label"> Orphaned Notes</div>
          {["DeFi yield comparison (4d old)", "Solana MEV research (6d old)"].map((n, i) => (
            <div key={i} className="row" style={{ padding: "8px 10px", margin: "0 -10px", display: "flex", justifyContent: "space-between", fontSize: 12, color: AGENT_C.t3 }}>
              <span>{n}</span>
              <button className="btn-sm">Link</button>
            </div>
          ))}
        </div>
      </div>

      {/* Duplicates */}
      <div style={{ marginTop: 16 }}>
        <div className="section-label">Duplicate Detection</div>
        <div className="row" style={{ padding: "10px 14px", margin: "0 -14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12.5, color: AGENT_C.t1 }}>"SOL breakout analysis"  "Solana momentum thesis"</div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t4, marginTop: 2 }}>87% similarity  both from this week</div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button className="btn-sm">Merge</button>
            <button className="btn-sm">Keep both</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 
// 6. AUTOMATION CONTROLS
// 
function AutomationTab() {
  const [quietHours, setQuietHours] = useState(true);
  const [maxCredits, setMaxCredits] = useState(50);
  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      {/* Rules */}
      <div className="section-label">Active Rules</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
        {[
          { rule: "If note mentions $SOL  tag #solana  queue for linking", active: true },
          { rule: "If trade logged  auto-tag asset + timeframe  queue digest", active: true },
          { rule: "If decision conflicts  flag for review  pause linking", active: false },
        ].map((r, i) => (
          <div key={i} className="row" style={{ padding: "10px 14px", margin: "0 -14px", display: "flex", alignItems: "center", gap: 12 }}>
            <div className={`toggle-track ${r.active ? "on" : ""}`} style={{ flexShrink: 0 }}
              onClick={() => {}}>
              <div className="toggle-thumb" style={{ left: r.active ? 18 : 2 }} />
            </div>
            <span style={{ fontSize: 12, color: r.active ? AGENT_C.t1 : AGENT_C.t4, fontFamily: "'Geist Mono',monospace", flex: 1 }}>{r.rule}</span>
            <button className="btn-sm">Edit</button>
          </div>
        ))}
        <button className="btn-action" style={{ background: AGENT_C.glass, color: AGENT_C.t3, border: `1px solid ${AGENT_C.border}`, alignSelf: "flex-start", marginTop: 4 }}>+ Add rule</button>
      </div>

      {/* Controls grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div className="section-label">Schedule & Triggers</div>
          <div style={{ padding: "12px 16px", borderRadius: 10, background: AGENT_C.glass, border: `1px solid ${AGENT_C.border}` }}>
            {[
              { source: "Schedule", detail: "Every 6h", active: true },
              { source: "Webhook", detail: "On note create", active: true },
              { source: "Hotkey", detail: "+Shift+A", active: true },
              { source: "Manual", detail: "Run now button", active: true },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 11.5, color: AGENT_C.t2 }}>
                <span>{t.source}</span>
                <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t4 }}>{t.detail}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="section-label">Guardrails</div>
          <div style={{ padding: "12px 16px", borderRadius: 10, background: AGENT_C.glass, border: `1px solid ${AGENT_C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11.5, color: AGENT_C.t2 }}>Quiet hours</span>
              <div className={`toggle-track ${quietHours ? "on" : ""}`} onClick={() => setQuietHours(!quietHours)}>
                <div className="toggle-thumb" style={{ left: quietHours ? 18 : 2 }} />
              </div>
            </div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t4, marginBottom: 10 }}>11pm  7am  no auto-runs</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 11.5, color: AGENT_C.t2 }}>Max credits/day</span>
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: AGENT_C.amber, fontWeight: 500 }}>{maxCredits}</span>
            </div>
            <input type="range" min="10" max="200" value={maxCredits} onChange={AGENT_E => setMaxCredits(AGENT_E.target.value)}
              style={{ width: "100%", accentColor: AGENT_C.amber, height: 3, marginTop: 4 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 
// 7. INCIDENTS & RECOVERY
// 
function IncidentTab() {
  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      <div className="section-label">Failure Inbox</div>
      {[
        { job: "Cleanup: validator economics draft", error: "Timeout after 30s  document exceeds 5,000 token context window", time: "2h ago", fix: "Split document into sections and retry" },
        { job: "Linking: DeFi yield comparison", error: "Tag model returned empty embeddings  model version mismatch", time: "6h ago", fix: "Update tag model to v2.1 and replay" },
      ].map((inc, i) => (
        <div key={i} style={{
          padding: "14px 16px", borderRadius: 10, marginBottom: 10,
          background: AGENT_C.roseD, border: `1px solid rgba(251,113,133,0.08)`,
          animation: `slideR .3s ${AGENT_E} ${i * .06}s both`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: AGENT_C.rose, fontWeight: 500 }}>{inc.job}</span>
            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t4 }}>{inc.time}</span>
          </div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10.5, color: "#fda4af", marginBottom: 8, lineHeight: 1.4 }}>
            {inc.error}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t3 }}>Suggested fix:</span>
            <span style={{ fontSize: 11, color: AGENT_C.t2 }}>{inc.fix}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn-action" style={{ background: AGENT_C.violetD, color: AGENT_C.violet, border: `1px solid rgba(167,139,250,0.12)`, fontSize: 10.5 }}>Replay</button>
            <button className="btn-action" style={{ background: AGENT_C.glass, color: AGENT_C.t3, border: `1px solid ${AGENT_C.border}`, fontSize: 10.5 }}>Dry run</button>
            <button className="btn-action" style={{ background: AGENT_C.glass, color: AGENT_C.t3, border: `1px solid ${AGENT_C.border}`, fontSize: 10.5 }}>Dismiss</button>
          </div>
        </div>
      ))}

      {/* Rollback */}
      <div style={{ marginTop: 16 }}>
        <div className="section-label">Safe Rollback</div>
        <div style={{ padding: "12px 16px", borderRadius: 10, background: AGENT_C.glass, border: `1px solid ${AGENT_C.border}` }}>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10.5, color: AGENT_C.t3, marginBottom: 10 }}>Undo last auto-edits. Changes are reversible within 24h.</div>
          {["Auto-tagged 3 notes (6h ago)", "Linked 2 decisions (6h ago)", "Cleaned draft formatting (1d ago)"].map((r, i) => (
            <div key={i} className="row" style={{ display: "flex", justifyContent: "space-between", padding: "6px 10px", margin: "0 -10px", fontSize: 11.5, color: AGENT_C.t2 }}>
              <span>{r}</span>
              <button className="btn-sm" style={{ color: AGENT_C.rose, borderColor: "rgba(251,113,133,0.12)" }}>Undo</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 
// 8. OUTCOME METRICS
// 
function MetricsTab() {
  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      {/* Hero metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Time saved", value: "47m", sub: "per day avg", color: AGENT_C.mint, trend: "+12%" },
          { label: "Manual actions avoided", value: "34", sub: "this week", color: AGENT_C.violet, trend: "+8" },
          { label: "Link coverage", value: "78%", sub: "of all notes", color: AGENT_C.sky, trend: "+6%" },
          { label: "Decision traceability", value: "91%", sub: "decisions  sources", color: AGENT_C.amber, trend: "+3%" },
        ].map((m, i) => (
          <div key={i} className="metric-card" style={{ animation: `slideR .3s ${AGENT_E} ${i * .05}s both` }}>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9.5, color: AGENT_C.t4, letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>{m.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontFamily: "'Outfit'", fontSize: 24, fontWeight: 300, color: m.color, letterSpacing: "-0.03em" }}>{m.value}</span>
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.mint, fontWeight: 500 }}>{m.trend}</span>
            </div>
            <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t5, marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Backlog trend */}
      <div className="section-label">Unprocessed Backlog Trend</div>
      <div style={{ padding: "14px 18px", borderRadius: 10, background: AGENT_C.glass, border: `1px solid ${AGENT_C.border}`, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end", height: 60 }}>
          {[42, 38, 31, 28, 22, 18, 14].map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: "100%", height: v * 1.2, borderRadius: 3,
                background: i === 6 ? AGENT_C.mint : AGENT_C.violetD,
                border: i === 6 ? `1px solid rgba(94,234,212,0.2)` : `1px solid rgba(167,139,250,0.1)`,
                transition: `height .4s ${AGENT_E}`,
              }} />
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 8.5, color: AGENT_C.t5 }}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Now"][i]}
              </span>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t4, marginTop: 10, textAlign: "center" }}>
          Backlog reduced 67% this week  14 items remaining
        </div>
      </div>

      {/* Credits efficiency */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div className="metric-card">
          <div className="section-label" style={{ marginBottom: 4 }}>Credits Efficiency</div>
          <div style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 300, color: AGENT_C.t1 }}>6.8 actions/credit</div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.mint, marginTop: 2 }}>+22% vs last week</div>
        </div>
        <div className="metric-card">
          <div className="section-label" style={{ marginBottom: 4 }}>Agent Uptime</div>
          <div style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 300, color: AGENT_C.t1 }}>99.2%</div>
          <div style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t4, marginTop: 2 }}>1 incident in 7d</div>
        </div>
      </div>
    </div>
  );
}

// 
// 9. AUDIT & COLLABORATION
// 
function AuditTab() {
  return (
    <div style={{ animation: `slideR .3s ${AGENT_E} both` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="section-label" style={{ marginBottom: 0 }}>Audit Log</div>
        <div style={{ display: "flex", gap: 6 }}>
          <button className="btn-action" style={{ background: AGENT_C.glass, color: AGENT_C.t3, border: `1px solid ${AGENT_C.border}`, fontSize: 10.5 }}>Export CSV</button>
          <button className="btn-action" style={{ background: AGENT_C.glass, color: AGENT_C.t3, border: `1px solid ${AGENT_C.border}`, fontSize: 10.5 }}>Export PDF</button>
        </div>
      </div>

      {/* Log entries */}
      {[
        { who: "Agent", action: "Auto-tagged 'Firedancer analysis' with #solana #infra", when: "12m ago", type: "auto", diff: "+2 tags" },
        { who: "Agent", action: "Linked 'SOL breakout'  'Momentum thesis'", when: "12m ago", type: "auto", diff: "+1 link" },
        { who: "You", action: "Approved link: 'JTO exit'  'TVL thesis'", when: "1h ago", type: "manual", diff: "Confirmed" },
        { who: "Agent", action: "Generated daily digest (3 notes, 2 trades)", when: "2h ago", type: "auto", diff: "+1 summary" },
        { who: "Agent", action: "Failed: Cleanup on validator draft (timeout)", when: "2h ago", type: "error", diff: "No changes" },
        { who: "You", action: "Changed mode: Conservative  Balanced", when: "6h ago", type: "config", diff: "Mode update" },
        { who: "Agent", action: "Linked 2 decisions to source notes", when: "6h ago", type: "auto", diff: "+2 links" },
        { who: "You", action: "Set weekly objective: Link Solana notes", when: "1d ago", type: "config", diff: "Objective set" },
      ].map((log, i) => (
        <div key={i} className="row" style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 14px", margin: "0 -14px",
          animation: `slideR .25s ${AGENT_E} ${i * .03}s both`,
        }}>
          {/* Who indicator */}
          <div style={{
            width: 22, height: 22, borderRadius: 6, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 600, fontFamily: "'Geist Mono',monospace",
            ...(log.who === "Agent"
              ? { background: AGENT_C.violetD, color: AGENT_C.violet, border: `1px solid rgba(167,139,250,0.12)` }
              : { background: AGENT_C.skyD, color: AGENT_C.sky, border: `1px solid rgba(56,189,248,0.12)` }),
          }}>
            {log.who === "Agent" ? "SB" : "You"}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 12, color: log.type === "error" ? AGENT_C.rose : AGENT_C.t1,
              fontWeight: log.type === "error" ? 500 : 400,
            }}>{log.action}</div>
          </div>

          <span className="badge" style={{
            fontSize: 9,
            ...(log.type === "auto" ? { background: AGENT_C.violetD, color: AGENT_C.violet, border: `1px solid rgba(167,139,250,0.08)` }
              : log.type === "manual" ? { background: AGENT_C.mintD, color: AGENT_C.mint, border: `1px solid rgba(94,234,212,0.08)` }
              : log.type === "error" ? { background: AGENT_C.roseD, color: AGENT_C.rose, border: `1px solid rgba(251,113,133,0.08)` }
              : { background: AGENT_C.skyD, color: AGENT_C.sky, border: `1px solid rgba(56,189,248,0.08)` }),
          }}>{log.diff}</span>

          <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 10, color: AGENT_C.t5, minWidth: 50, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
            {log.when}
          </span>
        </div>
      ))}

      {/* Change diff preview */}
      <div style={{ marginTop: 16 }}>
        <div className="section-label">Change Diff Preview</div>
        <div style={{
          padding: "12px 16px", borderRadius: 10,
          background: AGENT_C.glass, border: `1px solid ${AGENT_C.border}`,
          fontFamily: "'Geist Mono',monospace", fontSize: 11, lineHeight: 1.7,
        }}>
          <div style={{ color: AGENT_C.t4, marginBottom: 4 }}>Last auto-edit: "Firedancer mainnet analysis"</div>
          <div style={{ color: AGENT_C.mint }}>+ tags: #solana, #infrastructure</div>
          <div style={{ color: AGENT_C.mint }}>+ link:  "SOL long  breakout confirmation"</div>
          <div style={{ color: AGENT_C.t5 }}>  body: unchanged</div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            <button className="btn-sm">View full diff</button>
            <button className="btn-sm">Add comment</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// PANEL 3: SYSTEM
// 

function SystemPanel({ focusMode, active, mounted }) {
  const [hoveredConn, setHoveredConn] = useState(null);

  const connections = [
    { name: "Phantom wallet", state: "Connected", latency: null, age: "2m", severity: "info" },
    { name: "Helius RPC", state: "Live", latency: 48, age: null, severity: "info" },
    { name: "AI endpoint", state: "Rate Limited", latency: 120, age: null, severity: "warning" },
    { name: "Webhook export", state: "Config Missing", latency: null, age: null, severity: "critical" },
  ];

  const severityColor = (sev) => {
    if (sev === "critical") return T.rose;
    if (sev === "warning") return T.amber;
    return T.mint;
  };

  const stateAction = (state) => {
    if (state === "Config Missing" || state === "Auth Failed" || state === "Credits Exhausted") return "Fix now";
    if (state === "Rate Limited" || state === "Sync Delayed" || state === "Degraded") return "Monitor";
    return "No action";
  };

  const normalized = connections.map((c) => ({
    ...c,
    healthy: c.severity === "info",
    action: stateAction(c.state),
  }));

  const filteredConn = focusMode ? normalized.filter((c) => c.severity !== "info") : normalized;
  const healthyCount = normalized.filter((c) => c.severity === "info").length;
  const criticalCount = normalized.filter((c) => c.severity === "critical").length;
  const warningCount = normalized.filter((c) => c.severity === "warning").length;
  const systemState = criticalCount > 0 ? "Action Required" : warningCount > 0 ? "Degraded" : "Healthy";
  const systemStateColor = criticalCount > 0 ? T.rose : warningCount > 0 ? T.amber : T.mint;

  const latencyColor = (ms) => {
    if (ms === null) return T.t4;
    if (ms < 80) return T.mint;
    if (ms < 200) return T.amber;
    return T.rose;
  };

  return (
    <div style={{
      background: T.deep,
      borderRadius: 16,
      border: `1px solid ${T.rule}`,
      padding: "20px 24px",
      minHeight: 380,
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Panel accent  sky */}
      <div style={{
        position: "absolute",
        top: 0, left: 24, right: 24,
        height: 1,
        background: `linear-gradient(90deg, ${T.sky}, transparent 60%)`,
        opacity: 0.4,
      }} />

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 20,
      }}>
        <div>
          <h3 style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 17,
            fontWeight: 500,
            color: T.t1,
            margin: 0,
            letterSpacing: "-0.02em",
          }}>System Health</h3>
          <p style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10.5,
            color: T.t4,
            margin: "4px 0 0",
          }}>
            {healthyCount}/{normalized.length} healthy  {focusMode ? "issues only" : "all services"}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            padding: "4px 10px",
            borderRadius: 999,
            border: `1px solid ${systemStateColor === T.mint ? "rgba(95,186,125,0.25)" : systemStateColor === T.amber ? "rgba(201,168,76,0.25)" : "rgba(242,139,153,0.25)"}`,
            background: systemStateColor === T.mint ? T.mintDim : systemStateColor === T.amber ? T.amberDim : T.roseDim,
            color: systemStateColor,
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}>{systemState}</span>
          <span className="ghost-link" style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 11,
            color: T.t4,
          }}>
            manage
          </span>
        </div>
      </div>

      {/* Two-column: Connections + Usage */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
      }}>
        {/* Connections */}
        <div style={{
          animation: active ? `slideContent 0.4s ${EASE} both` : "none",
        }}>
          <div style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: T.t4,
            fontWeight: 500,
            textTransform: "uppercase",
            marginBottom: 10,
          }}>Connections</div>

          {filteredConn.map((c, i) => (
            <div
              key={i}
              className="conn-row row-interactive"
              onMouseEnter={() => setHoveredConn(i)}
              onMouseLeave={() => setHoveredConn(null)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 10px",
                marginLeft: -10,
                marginRight: -10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Status dot with ping animation for healthy */}
                <div style={{ position: "relative" }}>
                  <div style={{
                    width: 7, height: 7, borderRadius: "50%",
                    background: c.healthy ? T.mint : T.rose,
                    boxShadow: c.healthy
                      ? `0 0 6px ${T.mintGlow}`
                      : `0 0 6px ${T.roseGlow}`,
                  }} />
                  {!c.healthy && <div style={{
                    position: "absolute", inset: 0,
                    borderRadius: "50%",
                    background: severityColor(c.severity),
                    animation: "dotPing 1.5s ease-out infinite",
                  }} />}
                </div>
                <div>
                  <div style={{
                    fontSize: 13,
                    color: c.healthy ? T.t1 : severityColor(c.severity),
                    fontWeight: c.healthy ? 400 : 500,
                    fontFamily: "'Outfit', sans-serif",
                  }}>{c.name}</div>
                  <div style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 10,
                    color: c.healthy ? T.t4 : severityColor(c.severity),
                    marginTop: 1,
                  }}>{c.state}</div>
                </div>
              </div>
              <div style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10.5,
                fontVariantNumeric: "tabular-nums",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}>
                <span style={{
                  padding: "2px 7px",
                  borderRadius: 999,
                  border: `1px solid ${c.severity === "critical" ? "rgba(242,139,153,0.2)" : c.severity === "warning" ? "rgba(201,168,76,0.2)" : "rgba(95,186,125,0.18)"}`,
                  color: c.severity === "critical" ? T.rose : c.severity === "warning" ? T.amber : T.mint,
                  fontSize: 9.5,
                }}>{c.action}</span>
                {c.latency !== null && (
                  <span className="conn-latency" style={{
                    color: latencyColor(c.latency),
                    opacity: hoveredConn === i ? 1 : 0.5,
                    transition: `opacity 0.15s ${EASE}`,
                  }}>{c.latency}ms</span>
                )}
                {c.age && <span style={{ color: T.t5 }}>{c.age}</span>}
              </div>
            </div>
          ))}

          <div style={{
            marginTop: 14,
            padding: "10px 12px",
            background: T.glass,
            borderRadius: 10,
            border: `1px solid ${T.rule}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              {[
                { label: "Reconnect", tone: T.mint },
                { label: "Test webhook", tone: T.rose },
                { label: "Switch RPC", tone: T.amber },
                { label: "Clear queue", tone: T.t3 },
              ].map((a) => (
                <button key={a.label} style={{
                  height: 28,
                  borderRadius: 8,
                  border: `1px solid ${T.rule}`,
                  background: "rgba(255,255,255,0.02)",
                  color: a.tone,
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 10,
                  cursor: "pointer",
                  padding: "0 10px",
                }}>{a.label}</button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{
                border: `1px solid rgba(201,168,76,0.24)`,
                background: "rgba(201,168,76,0.12)",
                color: T.amber,
                borderRadius: 999,
                padding: "3px 8px",
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}>
                Alerts 1
              </span>
              <button style={{
                height: 28,
                borderRadius: 8,
                border: `1px solid ${T.rule}`,
                background: "rgba(255,255,255,0.02)",
                color: T.t3,
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10,
                cursor: "pointer",
                padding: "0 10px",
              }}>View logs</button>
              <button style={{
                height: 28,
                borderRadius: 8,
                border: `1px solid ${T.rule}`,
                background: "rgba(255,255,255,0.02)",
                color: T.violet,
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10,
                cursor: "pointer",
                padding: "0 10px",
              }}>Run backup</button>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                border: `1px solid ${T.rule}`,
                background: "rgba(255,255,255,0.02)",
                color: T.t3,
                borderRadius: 8,
                padding: "3px 8px",
                fontSize: 10.5,
              }}>
                Quick capture
                <span style={{
                  border: `1px solid ${T.rule}`,
                  borderRadius: 4,
                  padding: "1px 5px",
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 9,
                  color: T.t4,
                }}>Cmd .</span>
              </span>
            </div>
          </div>
        </div>

        {/* Usage + Metrics */}
        <div style={{
          animation: active ? `slideContent 0.4s ${EASE} 0.08s both` : "none",
        }}>
          <div style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: T.t4,
            fontWeight: 500,
            textTransform: "uppercase",
            marginBottom: 10,
          }}>Usage & Credits</div>

          {/* Credits visual */}
          <div style={{
            padding: "14px 16px",
            background: T.glass,
            borderRadius: 12,
            border: `1px solid ${T.rule}`,
            marginBottom: 14,
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 10,
            }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 26,
                fontWeight: 300,
                color: T.t1,
                letterSpacing: "-0.03em",
              }}>842</span>
              <span style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10.5,
                color: T.t4,
              }}>/ 1,000 credits</span>
            </div>
            <div style={{
              height: 4,
              background: T.raised,
              borderRadius: 2,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: "15.8%",
                background: `linear-gradient(90deg, ${T.violet}, ${T.sky})`,
                borderRadius: 2,
                animation: active ? `fillCredits 1s ${EASE} 0.3s both` : "none",
                boxShadow: `0 0 12px ${T.violetGlow}`,
              }} />
            </div>
          </div>

          {/* Stats */}
          <div style={{ fontSize: 12, lineHeight: 2.2 }}>
            {[
              { label: "Credits used", value: "158" },
              { label: "Proof fees (MTD)", value: "0.024 SOL" },
              { label: "Notes notarized", value: "11 / 54" },
              { label: "Rate-limit window", value: "resets in 03:40" },
              { label: "Last incident", value: "Webhook delivery (14m ago)" },
            ].map((s, i) => (
              <div key={i} className="stat-row" style={{
                display: "flex",
                justifyContent: "space-between",
              }}>
                <span style={{ color: T.t4 }}>{s.label}</span>
                <span style={{
                  fontFamily: "'Geist Mono', monospace",
                  color: T.t2,
                  fontVariantNumeric: "tabular-nums",
                  fontSize: 11,
                }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Burn */}
          <div style={{
            marginTop: 12,
            padding: "10px 14px",
            background: T.glass,
            borderRadius: 10,
            border: `1px solid ${T.rule}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: T.t4,
              fontStyle: "italic",
            }}>burn today</span>
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              color: T.t2,
              fontVariantNumeric: "tabular-nums",
            }}>0.006 SOL + 24 cr</span>
          </div>
        </div>
      </div>
    </div>
  );
}




