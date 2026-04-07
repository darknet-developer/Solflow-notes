"use client";

import { useEffect, useMemo, useState } from "react";
import { GravityWellOverview, type RecentActionItem } from "@/components/app/gravity-well-overview";
import { ContextStripGlass } from "@/components/app/context-strip-glass";
import { QuickActionsWorkspace } from "@/components/app/quick-actions-workspace";
import { ResourcesWorkspace } from "@/components/app/resources-workspace";

type ModalKey = null | "connections" | "agent" | "usage" | "import" | "feedback";
type PulseView = "bars" | "grid";
type MetricWindow = "7d" | "30d" | "90d";
const RECENT_ACTION_LOG_STORAGE_KEY = "sb_recent_actions_v1";


const actions: ReadonlyArray<{
  label: string;
  description: string;
  icon: string;
  hotkey: string;
  priority: "Primary" | "Secondary";
  status: "Ready" | "Pending" | "Attention";
  updated: string;
  requiresWallet?: boolean;
}> = [
  {
    label: "Capture note",
    description: "Free-form entry",
    icon: "CN",
    hotkey: "Cmd N",
    priority: "Primary",
    status: "Ready",
    updated: "updated 3m ago",
  },
  {
    label: "Log trade",
    description: "Position + thesis",
    icon: "LT",
    hotkey: "Cmd T",
    priority: "Primary",
    status: "Ready",
    updated: "updated 6m ago",
    requiresWallet: true,
  },
  {
    label: "Write decision",
    description: "Record + rationale",
    icon: "WD",
    hotkey: "Cmd D",
    priority: "Secondary",
    status: "Pending",
    updated: "2 pending",
  },
  {
    label: "Connect wallet",
    description: "Phantom - Solana",
    icon: "CW",
    hotkey: "Cmd W",
    priority: "Primary",
    status: "Ready",
    updated: "connected",
  },
  {
    label: "Open agent",
    description: "AI cleanup - tag - link",
    icon: "OA",
    hotkey: "Cmd A",
    priority: "Secondary",
    status: "Pending",
    updated: "2 queued tasks",
  },
  {
    label: "Review usage",
    description: "Credits - proofs - fees",
    icon: "RU",
    hotkey: "Cmd U",
    priority: "Secondary",
    status: "Attention",
    updated: "quota refresh in 9h",
  },
] as const;

const topActionCards = [
  { label: "Capture note", description: "Free-form thought, idea, or observation", hotkey: "? N", tone: "note" },
  { label: "Log trade", description: "Position entry, thesis, and target levels", hotkey: "? T", tone: "trade" },
  { label: "Write decision", description: "Record a choice with rationale and context", hotkey: "? D", tone: "decision" },
  { label: "Connect wallet", description: "Link Phantom for on-chain proof on Solana", hotkey: "? W", tone: "wallet" },
  { label: "Open agent", description: "AI cleanup, auto-tag, and link notes", hotkey: "? A", tone: "agent" },
  { label: "Review usage", description: "Credits, proof fees, and quota status", hotkey: "? U", tone: "usage" },
  { label: "Daily review", description: "Review today's notes, trades, and decisions", hotkey: "? R", tone: "usage" },
  { label: "Close position", description: "Log an exit and finalize trade outcome", hotkey: "? X", tone: "trade" },
  { label: "Set price alert", description: "Create trigger levels for key assets", hotkey: "? P", tone: "trade" },
  { label: "Quick capture voice", description: "Add a fast voice memo to inbox", hotkey: "? V", tone: "note" },
  { label: "Import statement", description: "Upload broker or wallet statement", hotkey: "? I", tone: "usage" },
  { label: "Export weekly report", description: "Generate and export weekly summary", hotkey: "? E", tone: "usage" },
  { label: "Create checklist", description: "Build a repeatable execution checklist", hotkey: "? C", tone: "decision" },
  { label: "Tag backlog", description: "Auto-tag and prioritize unclassified notes", hotkey: "? B", tone: "agent" },
  { label: "Summarize research", description: "Condense long research into key points", hotkey: "? S", tone: "agent" },
  { label: "Generate post-mortem", description: "Create a post-trade or decision review", hotkey: "? M", tone: "decision" },
  { label: "Reconcile wallet tx", description: "Match on-chain transfers and notes", hotkey: "? L", tone: "wallet" },
  { label: "Create automation", description: "Set recurring workflows and reminders", hotkey: "? O", tone: "agent" },
  { label: "Add event", description: "Create a new calendar event with date and time", hotkey: "? G", tone: "decision" },
  { label: "Schedule trade review", description: "Book a review slot for open or closed positions", hotkey: "? H", tone: "trade" },
  { label: "Set recurring routine", description: "Create a repeating daily or weekly routine", hotkey: "? J", tone: "agent" },
  { label: "Move alert to calendar", description: "Convert an alert into a scheduled calendar item", hotkey: "? K", tone: "usage" },
  { label: "Reschedule missed task", description: "Shift incomplete tasks to a new day/time", hotkey: "? Y", tone: "decision" },
  { label: "Auto-fill tomorrow plan", description: "Generate tomorrow's plan from current priorities", hotkey: "? Z", tone: "agent" },
] as const;

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;


const docs = [
  "Capture your first note",
  "Set up your trade journal",
  "Connect your wallet",
  "Understanding on-chain proof",
  "AI memory explained",
  "Pay with USDC",
  "Export your brain pack",
  "Keyboard shortcuts",
] as const;

const templates = [
  ["Trade entry", "Position, thesis, levels"],
  ["Post-mortem", "Review closed trades"],
  ["Meeting notes", "Agenda, takeaways, tasks"],
  ["Decision log", "Rationale + outcome"],
  ["Research note", "Structured deep-dive"],
  ["Weekly review", "Reflect, plan, prioritize"],
] as const;

const security = [
  ["Encryption", "AES-256 - active", "ok"],
  ["Storage", "Encrypted cloud", ""],
  ["Backup", "Auto - daily", "ok"],
  ["Privacy", "Zero-knowledge local", ""],
] as const;

const shortcuts = [
  ["New note", "Cmd N"],
  ["Search", "Cmd K"],
  ["Quick capture", "Cmd ."],
  ["Import / export", "Cmd I"],
  ["Send feedback", "Cmd ?"],
] as const;

function Modal({
  label,
  title,
  onClose,
}: {
  label: string;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.72)] p-6">
      <div className="relative w-full max-w-[720px] rounded-[22px] border border-[rgba(155,142,196,0.12)] bg-[#171732] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full border border-[rgba(155,142,196,0.10)] px-3 py-1 text-xs text-[#a29bbd]"
        >
          Close
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9690b1]">{label}</p>
        <h2 className="mt-3 text-[20px] font-medium text-[#ededf0]">{title}</h2>
        <div className="mt-5 rounded-[18px] border border-[rgba(155,142,196,0.08)] bg-[#1b1b37] p-4">
          <p className="text-sm leading-7 text-[#bbb4d2]">This entry point is preserved from the homepage design and can be wired into real flows next.</p>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [modal, setModal] = useState<ModalKey>(null);
  const [recentActionLog, setRecentActionLog] = useState<RecentActionItem[]>([]);
  const [metricWindow, setMetricWindow] = useState<MetricWindow>("7d");
  const [pulseView, setPulseView] = useState<PulseView>("bars");
  const [gridHover, setGridHover] = useState<{
    dateLabel: string;
    notes: number;
    trades: number;
    decisions: number;
    isToday: boolean;
  } | null>(null);

  const resolveModalFromAction = (label: string): ModalKey => {
    if (
      label === "Open agent"
      || label === "Tag backlog"
      || label === "Summarize research"
      || label === "Create automation"
      || label === "Set recurring routine"
      || label === "Auto-fill tomorrow plan"
    ) return "agent";
    if (
      label === "Review usage"
      || label === "Daily review"
      || label === "Export weekly report"
      || label === "Move alert to calendar"
    ) return "usage";
    if (label === "Import statement") return "import";
    if (label === "Connect wallet" || label === "Reconcile wallet tx") return "connections";
    return "feedback";
  };

  const resolveActionStatus = (label: string): RecentActionItem["status"] => {
    if (
      label === "Open agent"
      || label === "Tag backlog"
      || label === "Summarize research"
      || label === "Create automation"
      || label === "Set recurring routine"
      || label === "Auto-fill tomorrow plan"
      || label === "Schedule trade review"
    ) return "queued";
    return "done";
  };

  const logRecentAction = (label: string, source: RecentActionItem["source"] = "manual") => {
    const nextEntry: RecentActionItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      action: label,
      timestamp: Date.now(),
      status: resolveActionStatus(label),
      source,
      context: "quick action",
    };
    setRecentActionLog((prev) => {
      const next = [nextEntry, ...prev].slice(0, 200);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(RECENT_ACTION_LOG_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });
  };

  const pendingCount = actions.filter((item) => item.status === "Pending").length;
  const attentionCount = actions.filter((item) => item.status === "Attention").length;
  const allDays = useMemo(() => {
    const days: Array<{
      date: Date;
      dow: number;
      notes: number;
      trades: number;
      decisions: number;
      isToday: boolean;
    }> = [];
    const today = new Date(2026, 2, 29);
    for (let i = 364; i >= 0; i -= 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const jsDow = date.getDay();
      const dow = jsDow === 0 ? 6 : jsDow - 1;
      const weekday = dow >= 0 && dow <= 4;
      const base = i + dow * 7;
      const notes = base % (weekday ? 3 : 5) === 0 ? (base % 4) + 1 : 0;
      const trades = base % (weekday ? 5 : 9) === 0 ? (base % 2) + 1 : 0;
      const decisions = base % 11 === 0 ? 1 : 0;
      days.push({ date, dow, notes, trades, decisions, isToday: i === 0 });
    }
    return days;
  }, []);
  const windowDays = metricWindow === "7d" ? 7 : metricWindow === "30d" ? 30 : 90;
  const rangeDays = useMemo(() => allDays.slice(-windowDays), [allDays, windowDays]);
  const barsData = useMemo(() => {
    return rangeDays.map((day, index) => {
      const prev = index > 0 ? rangeDays[index - 1] : null;
      const monthStart = index === 0 || prev?.date.getMonth() !== day.date.getMonth();
      return {
      ...day,
      label: metricWindow === "7d" ? weekDays[day.dow] : `${day.date.getDate()}`,
      monthLabel: metricWindow === "7d" ? "" : (monthStart ? months[day.date.getMonth()] : ""),
    };
    });
  }, [metricWindow, rangeDays]);
  const maxBarTotal = useMemo(
    () => Math.max(...barsData.map((item) => item.notes + item.trades + item.decisions), 1),
    [barsData],
  );
  const gridDays = useMemo(() => allDays, [allDays]);
  const weeks = useMemo(() => {
    const grouped: typeof gridDays[] = [];
    let current: typeof gridDays = [];
    gridDays.forEach((day, index) => {
      current.push(day);
      if (day.dow === 6 || index === gridDays.length - 1) {
        grouped.push(current);
        current = [];
      }
    });
    return grouped;
  }, [gridDays]);
  const gridMaxActivity = useMemo(
    () => Math.max(...gridDays.map((day) => day.notes + day.trades + day.decisions), 1),
    [gridDays],
  );
  const gridTodayStatus = useMemo(() => {
    const todayDay = gridDays[gridDays.length - 1];
    if (!todayDay) return null;
    return {
      dateLabel: `${months[todayDay.date.getMonth()]} ${todayDay.date.getDate()}`,
      notes: todayDay.notes,
      trades: todayDay.trades,
      decisions: todayDay.decisions,
      isToday: true,
    };
  }, [gridDays]);
  const activeGridStatus = gridHover ?? gridTodayStatus;
  const pulseTotals = useMemo(() => {
    const notes = rangeDays.reduce((sum, day) => sum + day.notes, 0);
    const trades = rangeDays.reduce((sum, day) => sum + day.trades, 0);
    const decisions = rangeDays.reduce((sum, day) => sum + day.decisions, 0);
    const words = notes * 301 + decisions * 44;
    const positions = Math.max(0, Math.round(trades / 2));
    const pnl = positions > 0 ? ((trades * 1.8) / positions).toFixed(1) : "0.0";
    return { notes, words, positions, pnl, decisions };
  }, [rangeDays]);
  const insightsChips = useMemo(() => {
    const activeDays = rangeDays.filter((day) => day.notes + day.trades + day.decisions > 0).length;
    const decisionRate = pulseTotals.notes > 0 ? Math.round((pulseTotals.decisions / pulseTotals.notes) * 100) : 0;
    const bestDay = rangeDays.reduce(
      (best, day) => {
        const total = day.notes + day.trades + day.decisions;
        if (total > best.total) return { day, total };
        return best;
      },
      { day: rangeDays[0], total: -1 as number },
    );
    const bestDayLabel =
      metricWindow === "7d"
        ? weekDays[bestDay.day?.dow ?? 0]
        : `${months[(bestDay.day?.date ?? new Date()).getMonth()]} ${(bestDay.day?.date ?? new Date()).getDate()}`;
    return [
      { label: "Active days", value: `${activeDays}/${windowDays}` },
      { label: "Decision rate", value: `${decisionRate}%` },
      { label: "Best day", value: bestDayLabel },
      { label: "Output / day", value: `${Math.round(pulseTotals.words / Math.max(windowDays, 1)).toLocaleString()} w` },
    ];
  }, [rangeDays, pulseTotals.notes, pulseTotals.decisions, pulseTotals.words, windowDays, metricWindow]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(RECENT_ACTION_LOG_STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as RecentActionItem[];
      if (Array.isArray(parsed)) {
        setRecentActionLog(parsed.slice(0, 200));
      }
    } catch {
      setRecentActionLog([]);
    }
  }, []);

  return (
    <main className="min-h-full overflow-x-hidden bg-[#000000] text-[#ededf0]">
      <ContextStripGlass />
      <div className="mx-auto grid w-full max-w-[1120px] gap-4 px-6 py-5">
        <GravityWellOverview
        recentActionLog={recentActionLog}
        insightsContent={(
        <div className="ap-pulse">
          <div className="ap-pulse-head">
            {pulseView === "grid" ? (
              <div className="ap-grid-hover-panel ap-grid-hover-top" role="status" aria-live="polite">
                {activeGridStatus ? (
                  <>
                    <span className="ap-grid-hover-date">
                      {activeGridStatus.dateLabel}
                      {activeGridStatus.isToday ? " - Today" : ""}
                    </span>
                    <span className="ap-grid-hover-sep" />
                    {activeGridStatus.notes ? <span className="ap-grid-hover-item"><span className="ap-tip-dot n" />{activeGridStatus.notes} note{activeGridStatus.notes > 1 ? "s" : ""}</span> : null}
                    {activeGridStatus.trades ? <span className="ap-grid-hover-item"><span className="ap-tip-dot t" />{activeGridStatus.trades} trade{activeGridStatus.trades > 1 ? "s" : ""}</span> : null}
                    {activeGridStatus.decisions ? <span className="ap-grid-hover-item"><span className="ap-tip-dot d" />{activeGridStatus.decisions} decision{activeGridStatus.decisions > 1 ? "s" : ""}</span> : null}
                    {!activeGridStatus.notes && !activeGridStatus.trades && !activeGridStatus.decisions ? (
                      <span className="ap-grid-hover-muted">No activity</span>
                    ) : null}
                  </>
                ) : (
                  <span className="ap-grid-hover-muted">No activity</span>
                )}
              </div>
            ) : (
              <div className="ap-pulse-head-spacer" />
            )}
            <div className="ap-pulse-controls">
              <div className="ap-view-toggle">
                <button
                  type="button"
                  className={`ap-vt-btn ${pulseView === "bars" ? "active" : ""}`}
                  onClick={() => setPulseView("bars")}
                  title="Bar chart"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="6" width="3" height="7" rx=".5" fill="currentColor" /><rect x="5.5" y="3" width="3" height="10" rx=".5" fill="currentColor" /><rect x="10" y="1" width="3" height="12" rx=".5" fill="currentColor" /></svg>
                </button>
                <button
                  type="button"
                  className={`ap-vt-btn ${pulseView === "grid" ? "active" : ""}`}
                  onClick={() => setPulseView("grid")}
                  title="Contribution grid"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="2.5" height="2.5" rx=".5" fill="currentColor" /><rect x="5" y="1" width="2.5" height="2.5" rx=".5" fill="currentColor" /><rect x="9" y="1" width="2.5" height="2.5" rx=".5" fill="currentColor" /><rect x="1" y="5" width="2.5" height="2.5" rx=".5" fill="currentColor" /><rect x="5" y="5" width="2.5" height="2.5" rx=".5" fill="currentColor" /><rect x="9" y="5" width="2.5" height="2.5" rx=".5" fill="currentColor" /><rect x="1" y="9" width="2.5" height="2.5" rx=".5" fill="currentColor" /><rect x="5" y="9" width="2.5" height="2.5" rx=".5" fill="currentColor" /><rect x="9" y="9" width="2.5" height="2.5" rx=".5" fill="currentColor" /></svg>
                </button>
              </div>
              <div className="ap-pulse-range">
                {pulseView === "bars" ? (
                  (["7d", "30d", "90d"] as const).map((window) => (
                    <button
                      key={window}
                      type="button"
                      onClick={() => setMetricWindow(window)}
                      className={`ap-range-btn ${metricWindow === window ? "active" : ""}`}
                    >
                      {window.toUpperCase()}
                    </button>
                  ))
                ) : (
                  <button type="button" className="ap-range-btn active" aria-label="One year range">
                    1Y
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="ap-chart-area">
            <div className={`ap-view-bars ${pulseView !== "bars" ? "hidden" : ""}`}>
              <div className={`ap-chart ${metricWindow !== "7d" ? "dense" : ""}`}>
                {barsData.map((day, index) => {
                  const total = day.notes + day.trades + day.decisions;
                  const scale = total > 0 ? total / maxBarTotal : 0;
                  const notesHeight = total > 0 ? (day.notes / total) * (scale * 70) : 0;
                  const tradesHeight = total > 0 ? (day.trades / total) * (scale * 70) : 0;
                  const decisionsHeight = total > 0 ? (day.decisions / total) * (scale * 70) : 0;
                  return (
                    <div key={`${day.date.toISOString()}-${index}`} className="ap-chart-day">
                      <div className="ap-ttip">
                        {day.notes ? <div className="ap-tip-row"><span className="ap-tip-dot n" /><span className="ap-tip-val">{day.notes} note{day.notes > 1 ? "s" : ""}</span></div> : null}
                        {day.trades ? <div className="ap-tip-row"><span className="ap-tip-dot t" /><span className="ap-tip-val">{day.trades} trade{day.trades > 1 ? "s" : ""}</span></div> : null}
                        {day.decisions ? <div className="ap-tip-row"><span className="ap-tip-dot d" /><span className="ap-tip-val">{day.decisions} decision{day.decisions > 1 ? "s" : ""}</span></div> : null}
                        {!total ? <div className="ap-tip-row"><span className="ap-tip-val ap-tip-muted">No activity</span></div> : null}
                      </div>
                      <div className="ap-chart-bar-wrap">
                        {decisionsHeight > 0 ? <div className="ap-bar-seg decisions" style={{ height: `${decisionsHeight}px`, animationDelay: `${0.08 + index * 0.06}s` }} /> : null}
                        {tradesHeight > 0 ? <div className="ap-bar-seg trades" style={{ height: `${tradesHeight}px`, animationDelay: `${0.05 + index * 0.06}s` }} /> : null}
                        {notesHeight > 0 ? <div className="ap-bar-seg notes" style={{ height: `${notesHeight}px`, animationDelay: `${0.02 + index * 0.06}s` }} /> : null}
                        {!total ? <div className="ap-empty-bar" /> : null}
                      </div>
                      <span className={`ap-day-axis ${day.isToday ? "today" : ""}`}>
                        <span className="ap-day-num">{day.label}</span>
                        <span className="ap-day-month">{day.monthLabel}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`ap-view-grid ${pulseView !== "grid" ? "hidden" : ""}`}>
              <div className="ap-grid-wrap">
                <div className="ap-grid-labels">
                  {weekDays.map((name, idx) => (
                    <div key={name} className={`ap-grid-day-label ${[1, 3, 5].includes(idx) ? "" : "hide"}`}>{name.slice(0, 2)}</div>
                  ))}
                </div>
                <div className="ap-grid-container">
                  <div className="ap-grid-months">
                    {weeks.map((week, idx) => {
                      const month = week[0].date.getMonth();
                      const prevMonth = idx > 0 ? weeks[idx - 1][0].date.getMonth() : -1;
                      return <span key={`m-${idx}`} className="ap-grid-month">{month !== prevMonth ? months[month] : ""}</span>;
                    })}
                  </div>
                  <div className="ap-grid-inner">
                    {weeks.map((week, weekIndex) => (
                      <div key={`w-${weekIndex}`} className="ap-grid-col">
                        {weekIndex === 0 && week[0].dow > 0
                          ? Array.from({ length: week[0].dow }).map((_, padIdx) => <div key={`pad-${padIdx}`} className="ap-grid-cell lv-0 pad" />)
                          : null}
                        {week.map((day, dayIndex) => {
                          const total = day.notes + day.trades + day.decisions;
                          const segments: string[] = [];
                          if (day.notes > 0) segments.push("#b590ff");
                          if (day.trades > 0) segments.push("#5fba7d");
                          if (day.decisions > 0) segments.push("#c9a84c");
                          let splitBg = "rgba(255, 255, 255, 0.03)";
                          if (segments.length === 1) {
                            splitBg = segments[0];
                          } else if (segments.length === 2) {
                            splitBg = `linear-gradient(90deg, ${segments[0]} 0%, ${segments[0]} 50%, ${segments[1]} 50%, ${segments[1]} 100%)`;
                          } else if (segments.length === 3) {
                            splitBg = `linear-gradient(90deg, ${segments[0]} 0%, ${segments[0]} 33.33%, ${segments[1]} 33.33%, ${segments[1]} 66.66%, ${segments[2]} 66.66%, ${segments[2]} 100%)`;
                          }
                          return (
                            <div
                              key={`d-${weekIndex}-${dayIndex}`}
                              className={`ap-grid-cell ${day.isToday ? "today" : ""} ${day.dow <= 3 ? "row-top" : "row-bottom"} ${total === 0 ? "idle" : ""}`}
                              style={{ background: splitBg }}
                              onMouseEnter={() =>
                                setGridHover({
                                  dateLabel: `${months[day.date.getMonth()]} ${day.date.getDate()}`,
                                  notes: day.notes,
                                  trades: day.trades,
                                  decisions: day.decisions,
                                  isToday: day.isToday,
                                })
                              }
                              onFocus={() =>
                                setGridHover({
                                  dateLabel: `${months[day.date.getMonth()]} ${day.date.getDate()}`,
                                  notes: day.notes,
                                  trades: day.trades,
                                  decisions: day.decisions,
                                  isToday: day.isToday,
                                })
                              }
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="ap-pulse-bottom">
            <div className="ap-metrics-ribbon">
              <div className="ap-m-item"><span className="ap-m-val">{pulseTotals.notes}</span> notes</div>
              <div className="ap-m-sep" />
              <div className="ap-m-item"><span className="ap-m-val">{pulseTotals.words.toLocaleString()}</span> words</div>
              <div className="ap-m-sep" />
              <div className="ap-m-item"><span className="ap-m-val">{pulseTotals.positions}</span> positions <span className="ap-m-val pos">+{pulseTotals.pnl}%</span></div>
              <div className="ap-m-sep" />
              <div className="ap-m-item"><span className="ap-m-val">{pulseTotals.decisions}</span> decisions</div>
              <div className="ap-m-sep" />
              <div className="ap-m-item">synced <span className="ap-m-val">2m</span> ago</div>
            </div>
            <div className="ap-legend">
              <div className="ap-leg-item"><span className="ap-leg-dot n" />Notes</div>
              <div className="ap-leg-item"><span className="ap-leg-dot t" />Trades</div>
              <div className="ap-leg-item"><span className="ap-leg-dot d" />Decisions</div>
            </div>
          </div>
          <div className="ap-insights-chips">
            {insightsChips.map((chip) => (
              <div key={chip.label} className="ap-insight-chip">
                <span className="ap-insight-label">{chip.label}</span>
                <span className="ap-insight-value">{chip.value}</span>
              </div>
            ))}
          </div>
          <div className="ap-insight-focus">
            <div className="ap-insight-focus-copy">
              <span className="ap-insight-focus-label">Focus this week</span>
              <span className="ap-insight-focus-dot" />
              <span className="ap-insight-focus-text">3 active days below baseline, strongest output on Fri</span>
            </div>
            <button type="button" className="ap-insight-focus-action" onClick={() => setModal("agent")}>
              Open agent ?
            </button>
          </div>
        </div>
        )} />

        <div className="ap-section-divide">
          <span className="ap-section-title">Quick actions</span>
          <div className="ap-section-line" />
        </div>

        <div className="ap-actions-section">
          <QuickActionsWorkspace
            actions={topActionCards}
            onTriggerAction={(label) => {
              logRecentAction(label, "manual");
            }}
          />
        </div>

        <div className="ap-attention">
          <svg className="ap-att-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <div className="ap-att-text"><span>{pendingCount} pending</span> decisions - <span>{attentionCount}</span> action needs attention</div>
          <button type="button" className="ap-att-action" onClick={() => setModal("agent")}>Open agent ?</button>
        </div>

        <div className="ap-section-divide">
          <span className="ap-section-title">Resources</span>
          <div className="ap-section-line" />
        </div>

        <div className="flex flex-col gap-2.5">
          <ResourcesWorkspace
            docs={docs}
            templates={templates}
            security={security}
            shortcuts={shortcuts}
          />
        </div>
      </div>

      <style jsx>{`
        .ap-ctx {
          display: grid;
          grid-template-columns: minmax(320px, 1.4fr) 1px minmax(220px, 0.9fr) 1px minmax(220px, 1fr);
          align-items: stretch;
          gap: 0;
          border: 1px solid rgba(155, 142, 196, 0.1);
          border-radius: 12px;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.018), rgba(255, 255, 255, 0.006));
          overflow: hidden;
        }
        .ap-ctx-zone {
          min-height: 92px;
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }
        .ap-ctx-divider {
          background: rgba(155, 142, 196, 0.12);
          width: 1px;
          align-self: stretch;
        }
        .ap-ctx-zone-session {
          gap: 10px;
        }
        .ap-ctx-zone-account {
          align-items: flex-end;
          justify-content: center;
          gap: 8px;
        }
        .ap-ctx-path,
        .ap-ctx-sync {
          font-size: 10px;
          color: #7a7397;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .ap-ctx-sync {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .ap-ctx-stats {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .ap-ctx-stat {
          font-size: 11px;
          color: #8f88ad;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          letter-spacing: 0.01em;
        }
        .ap-ctx-stat strong {
          color: #b8b0d0;
          font-weight: 500;
        }
        .ap-ctx-stat.alert {
          color: #d27a7a;
        }
        .ap-ctx-left {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }
        .ap-ctx-greeting {
          font-size: 28px;
          font-weight: 700;
          color: #e8e8ec;
          letter-spacing: -0.01em;
        }
        .ap-ctx-date {
          font-size: 12px;
          color: #7c74a1;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
        }
        .ap-ctx-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ap-ctx-pill {
          font-size: 12px;
          color: #b8b0d0;
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 999px;
          border: 1px solid rgba(155, 142, 196, 0.12);
          background: rgba(255, 255, 255, 0.02);
        }
        .ap-ctx-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #6db87a;
          box-shadow: 0 0 6px rgba(109, 184, 122, 0.4);
        }
        .ap-ctx-credits {
          font-size: 14px;
          color: #c9a84c;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-weight: 700;
          padding: 5px 11px;
          border-radius: 999px;
          border: 1px solid rgba(201, 168, 76, 0.18);
          background: rgba(201, 168, 76, 0.08);
        }
        @media (max-width: 1050px) {
          .ap-ctx {
            grid-template-columns: 1fr;
          }
          .ap-ctx-divider {
            display: none;
          }
          .ap-ctx-zone {
            min-height: auto;
            border-top: 1px solid rgba(155, 142, 196, 0.1);
          }
          .ap-ctx-zone:first-child {
            border-top: none;
          }
          .ap-ctx-zone-account {
            align-items: flex-start;
          }
          .ap-ctx-right {
            flex-wrap: wrap;
          }
        }
        .ap-pulse {
          background: #121127;
          border: 1px solid rgba(200, 195, 230, 0.06);
          border-radius: 10px;
          padding: 20px 24px 24px;
          min-height: 420px;
          position: relative;
          overflow: clip;
        }
        .ap-pulse::before {
          content: "";
          position: absolute;
          top: 0;
          left: 20px;
          right: 20px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(165, 148, 224, 0.12) 30%, rgba(201, 168, 76, 0.08) 70%, transparent);
        }
        .ap-pulse-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          min-height: 28px;
          margin-bottom: 18px;
          gap: 12px;
        }
        .ap-pulse-head-spacer {
          flex: 1 1 auto;
          min-height: 1px;
        }
        .ap-pulse-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
          position: relative;
          z-index: 1;
        }
        .ap-view-toggle {
          display: flex;
          border: 1px solid rgba(200, 195, 230, 0.06);
          border-radius: 6px;
          overflow: hidden;
        }
        .ap-vt-btn {
          width: 30px;
          height: 26px;
          border: none;
          background: transparent;
          color: #7c74a1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }
        .ap-vt-btn:hover {
          color: #a8a1c3;
          background: rgba(255, 255, 255, 0.02);
        }
        .ap-vt-btn.active {
          color: #e8e8ec;
          background: rgba(255, 255, 255, 0.05);
        }
        .ap-vt-btn + .ap-vt-btn {
          border-left: 1px solid rgba(200, 195, 230, 0.06);
        }
        .ap-pulse-range {
          display: flex;
          gap: 4px;
        }
        .ap-range-btn {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 10px;
          padding: 3px 10px;
          border-radius: 5px;
          border: 1px solid rgba(200, 195, 230, 0.06);
          background: transparent;
          color: #7c74a1;
          cursor: pointer;
        }
        .ap-range-btn.active {
          background: rgba(255, 255, 255, 0.04);
          color: #e8e8ec;
          border-color: rgba(200, 195, 230, 0.13);
        }
        .ap-chart-area {
          position: relative;
          min-height: 132px;
          margin-bottom: 14px;
          overflow: clip;
          contain: layout paint;
        }
        .ap-view-bars,
        .ap-view-grid {
          transition: opacity 0.25s ease;
        }
        .ap-view-grid {
          overflow: clip;
          contain: layout paint;
          padding-bottom: 10px;
          box-sizing: border-box;
        }
        .ap-view-bars {
          overflow-x: auto;
          overflow-y: hidden;
        }
        .ap-view-bars.hidden,
        .ap-view-grid.hidden {
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          pointer-events: none;
        }
        .ap-chart {
          display: flex;
          align-items: flex-end;
          height: 104px;
          padding: 0 2px;
          min-width: max-content;
        }
        .ap-chart-day {
          flex: 1;
          min-width: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .ap-chart-bar-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          height: 72px;
          gap: 1px;
          padding: 0 6px;
        }
        .ap-bar-seg {
          width: 100%;
          max-width: 48px;
          border-radius: 3px 3px 1px 1px;
          min-height: 0;
          animation: ap-bar-grow 0.5s ease both;
        }
        .ap-bar-seg.notes {
          background: #b590ff;
          opacity: 0.7;
        }
        .ap-bar-seg.trades {
          background: #5fba7d;
          opacity: 0.8;
        }
        .ap-bar-seg.decisions {
          background: #c9a84c;
          opacity: 0.8;
        }
        .ap-empty-bar {
          width: 100%;
          max-width: 48px;
          height: 3px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.04);
        }
        .ap-day-axis {
          margin-top: 7px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 22px;
        }
        .ap-day-num {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 9px;
          color: #7c74a1;
          text-transform: uppercase;
        }
        .ap-day-month {
          margin-top: 1px;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 8px;
          line-height: 1;
          color: #5e5e74;
          text-transform: uppercase;
        }
        .ap-day-axis.today .ap-day-num {
          color: #e8e8ec;
          font-weight: 600;
        }
        .ap-chart.dense .ap-chart-day {
          min-width: 15px;
        }
        .ap-chart.dense .ap-chart-bar-wrap {
          padding: 0 2px;
        }
        .ap-chart.dense .ap-bar-seg {
          max-width: 8px;
        }
        .ap-chart.dense .ap-day-num {
          font-size: 8px;
          color: #5a5a72;
        }
        .ap-chart.dense .ap-day-month {
          font-size: 7px;
          letter-spacing: 0.02em;
        }
        .ap-ttip {
          position: absolute;
          bottom: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          background: #1a1a35;
          border: 1px solid rgba(200, 195, 230, 0.13);
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 10px;
          color: #e8e8ec;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s;
          z-index: 9999;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.5);
        }
        .ap-chart-day .ap-ttip {
          bottom: 68px;
        }
        .ap-chart.dense .ap-chart-day .ap-ttip {
          bottom: 60px;
        }
        .ap-chart-day:hover .ap-ttip {
          opacity: 1;
        }
        .ap-tip-row {
          display: flex;
          align-items: center;
          gap: 5px;
          margin: 1px 0;
        }
        .ap-tip-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }
        .ap-tip-dot.n { background: #b590ff; }
        .ap-tip-dot.t { background: #5fba7d; }
        .ap-tip-dot.d { background: #c9a84c; }
        .ap-tip-val { color: #a8a1c3; }
        .ap-tip-muted { color: #7c74a1; }
        .ap-tip-date {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 9px;
          color: #7c74a1;
          margin-bottom: 2px;
        }
        .ap-grid-hover-panel {
          height: 28px;
          min-height: 28px;
          max-height: 28px;
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: nowrap;
          padding: 4px 8px;
          border: 1px solid rgba(200, 195, 230, 0.08);
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.02);
          color: #a8a1c3;
          font-size: 10px;
          overflow: hidden;
          box-sizing: border-box;
        }
        .ap-grid-hover-top {
          margin-top: 0;
          position: absolute;
          left: 0;
          top: 0;
          width: fit-content;
          max-width: calc(100% - 140px);
        }
        .ap-grid-hover-date {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          color: #e8e8ec;
          font-size: 9px;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }
        .ap-grid-hover-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #7c74a1;
          opacity: 0.6;
        }
        .ap-grid-hover-item {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #a0a0b2;
          white-space: nowrap;
        }
        .ap-grid-hover-muted {
          color: #5f5f74;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ap-grid-wrap {
          display: block;
          width: 100%;
        }
        .ap-grid-labels {
          display: none;
        }
        .ap-grid-day-label {
          height: 13px;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 8.5px;
          color: #7c74a1;
          display: flex;
          align-items: center;
          line-height: 1;
        }
        .ap-grid-day-label.hide { visibility: hidden; }
        .ap-grid-container {
          width: 100%;
          overflow: clip;
          padding-bottom: 2px;
          box-sizing: border-box;
        }
        .ap-grid-months {
          display: flex;
          gap: 3px;
          margin-bottom: 4px;
          width: 100%;
          padding: 0 8px;
          box-sizing: border-box;
        }
        .ap-grid-month {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 8.5px;
          color: #7c74a1;
          flex: 1 1 0;
          width: auto;
          white-space: nowrap;
          overflow: hidden;
        }
        .ap-grid-inner {
          display: flex;
          gap: 3px;
          width: 100%;
          overflow: clip;
          padding: 0 8px 2px;
          box-sizing: border-box;
        }
        .ap-grid-col {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1 1 0;
          min-width: 0;
        }
        .ap-grid-cell {
          width: calc(100% - 1px);
          height: auto;
          aspect-ratio: 1 / 1;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.03);
          animation: ap-cell-pop 0.3s ease both;
          margin: 0 auto;
        }
        .ap-grid-cell.today {
          box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.2);
        }
        .ap-grid-cell.pad {
          opacity: 0.3;
          pointer-events: none;
        }
        .ap-grid-cell.idle { background: rgba(255, 255, 255, 0.03) !important; }
        .ap-pulse-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .ap-insights-chips {
          margin-top: 12px;
          padding-top: 10px;
          border-top: 1px solid rgba(200, 195, 230, 0.06);
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }
        .ap-insight-chip {
          border: 1px solid rgba(200, 195, 230, 0.08);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 8px 10px;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
          min-height: 34px;
        }
        .ap-insight-label {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 9.5px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #7c74a1;
        }
        .ap-insight-value {
          font-size: 12px;
          font-weight: 600;
          color: #b8b0d0;
          font-variant-numeric: tabular-nums;
        }
        .ap-insight-focus {
          margin-top: 6px;
          border: 1px solid rgba(200, 195, 230, 0.08);
          background: rgba(255, 255, 255, 0.015);
          border-radius: 9px;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .ap-insight-focus-copy {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .ap-insight-focus-label {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7c74a1;
          white-space: nowrap;
        }
        .ap-insight-focus-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #7c74a1;
          flex-shrink: 0;
        }
        .ap-insight-focus-text {
          font-size: 12px;
          color: #b8b0d0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ap-insight-focus-action {
          border: 1px solid rgba(200, 195, 230, 0.12);
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
          padding: 5px 10px;
          color: #a8a1c3;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 10.5px;
          letter-spacing: 0.02em;
          white-space: nowrap;
          cursor: pointer;
        }
        .ap-insight-focus-action:hover {
          color: #e8e8ec;
          border-color: rgba(200, 195, 230, 0.2);
        }
        .ap-metrics-ribbon {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
        .ap-m-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #a8a1c3;
          padding: 4px 0;
        }
        .ap-m-val {
          font-weight: 700;
          color: #e8e8ec;
          font-variant-numeric: tabular-nums;
        }
        .ap-m-val.pos { color: #5fba7d; }
        .ap-m-sep {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #7c74a1;
          opacity: 0.5;
          margin: 0 12px;
        }
        .ap-legend {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ap-leg-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: #7c74a1;
        }
        .ap-leg-dot {
          width: 6px;
          height: 6px;
          border-radius: 2px;
        }
        .ap-leg-dot.n { background: #b590ff; opacity: 0.7; }
        .ap-leg-dot.t { background: #5fba7d; opacity: 0.8; }
        .ap-leg-dot.d { background: #c9a84c; opacity: 0.8; }
        .ap-section-divide {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 26px;
          margin-bottom: 18px;
          padding: 0;
        }
        .ap-section-title {
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 9.5px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #7c74a1;
          font-weight: 500;
        }
        .ap-section-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(200, 195, 230, 0.06), transparent 70%);
        }
        .ap-actions-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        .ap-action-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px 16px;
          border: 1px solid rgba(200, 195, 230, 0.06);
          border-radius: 10px;
          background: #121127;
          color: #a8a1c3;
          cursor: pointer;
          text-align: left;
          transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
        }
        .ap-action-card:hover {
          background: #1a1a35;
          border-color: rgba(200, 195, 230, 0.13);
        }
        .ap-ac-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(200, 195, 230, 0.06);
        }
        .ap-ac-icon svg { width: 16px; height: 16px; }
        .ap-action-card.c-note .ap-ac-icon { background: rgba(165, 148, 224, 0.1); color: #b590ff; }
        .ap-action-card.c-trade .ap-ac-icon { background: rgba(95, 186, 125, 0.1); color: #5fba7d; }
        .ap-action-card.c-decision .ap-ac-icon { background: rgba(201, 168, 76, 0.1); color: #c9a84c; }
        .ap-action-card.c-wallet .ap-ac-icon { background: rgba(95, 186, 125, 0.1); color: #5fba7d; }
        .ap-action-card.c-agent .ap-ac-icon { background: rgba(138, 138, 154, 0.08); color: #8a8a9a; }
        .ap-action-card.c-usage .ap-ac-icon { background: rgba(201, 168, 76, 0.1); color: #c9a84c; }
        .ap-ac-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .ap-ac-name {
          font-size: 13px;
          font-weight: 600;
          color: #e8e8ec;
        }
        .ap-ac-desc {
          font-size: 11px;
          color: #7c74a1;
          line-height: 1.4;
        }
        .ap-ac-shortcut {
          margin-top: 4px;
          font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 9.5px;
          color: #7c74a1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(200, 195, 230, 0.06);
          border-radius: 4px;
          padding: 2px 6px;
          width: fit-content;
        }
        .ap-attention {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: rgba(201, 168, 76, 0.1);
          border: 1px solid rgba(201, 168, 76, 0.1);
          border-radius: 8px;
          font-size: 12px;
          color: #a8a1c3;
        }
        .ap-att-icon {
          color: #c9a84c;
          flex-shrink: 0;
        }
        .ap-att-text span {
          color: #e8e8ec;
          font-weight: 600;
        }
        .ap-att-action {
          margin-left: auto;
          font-size: 11px;
          color: #c9a84c;
          cursor: pointer;
          white-space: nowrap;
          font-weight: 500;
          background: transparent;
          border: 0;
        }
        .ap-att-action:hover {
          color: #e8e8ec;
        }
        @media (max-width: 1200px) {
          .ap-actions-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .ap-insights-chips {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 820px) {
          .ap-ctx {
            flex-wrap: wrap;
          }
          .ap-actions-grid {
            grid-template-columns: 1fr;
          }
          .ap-insights-chips {
            grid-template-columns: 1fr;
          }
          .ap-insight-focus {
            flex-direction: column;
            align-items: flex-start;
          }
        }
        @keyframes ap-bar-grow {
          from { transform: scaleY(0); transform-origin: bottom; }
          to { transform: scaleY(1); transform-origin: bottom; }
        }
        @keyframes ap-cell-pop {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {modal === "connections" ? (
        <Modal label="connections" title="Connection settings" onClose={() => setModal(null)} />
      ) : null}
      {modal === "agent" ? <Modal label="agent" title="Agent panel" onClose={() => setModal(null)} /> : null}
      {modal === "usage" ? <Modal label="usage" title="Usage and credits" onClose={() => setModal(null)} /> : null}
      {modal === "import" ? <Modal label="import" title="Import flow" onClose={() => setModal(null)} /> : null}
      {modal === "feedback" ? <Modal label="feedback" title="Feedback" onClose={() => setModal(null)} /> : null}
    </main>
  );
}




