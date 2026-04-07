"use client";

import { useMemo, useState } from "react";
import { QUICK_ACTION_MODAL_MAP } from "@/components/app/quick-actions/modals";

export type QuickActionTone = "note" | "trade" | "decision" | "wallet" | "agent" | "usage";

export type QuickActionCard = {
  label: string;
  description: string;
  hotkey: string;
  tone: QuickActionTone;
};

type QuickActionCategory =
  | "Capture"
  | "Trading"
  | "Decisions"
  | "Calendar"
  | "Wallet"
  | "Automation"
  | "Ops";

type QuickActionsWorkspaceProps = {
  actions: readonly QuickActionCard[];
  onTriggerAction: (label: string) => void;
};

const CATEGORY_ORDER: QuickActionCategory[] = [
  "Capture",
  "Trading",
  "Decisions",
  "Calendar",
  "Wallet",
  "Automation",
  "Ops",
];

const CALENDAR_LABELS = new Set([
  "Add event",
  "Schedule trade review",
  "Set recurring routine",
  "Move alert to calendar",
  "Reschedule missed task",
  "Auto-fill tomorrow plan",
]);

function resolveCategory(action: QuickActionCard): QuickActionCategory {
  if (CALENDAR_LABELS.has(action.label)) return "Calendar";
  if (action.tone === "wallet") return "Wallet";
  if (action.tone === "trade") return "Trading";
  if (action.tone === "decision") return "Decisions";
  if (action.tone === "note") return "Capture";
  if (action.tone === "agent") return "Automation";
  return "Ops";
}

function ToneIcon({ tone }: { tone: QuickActionTone }) {
  if (tone === "note") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>;
  if (tone === "trade") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>;
  if (tone === "decision") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
  if (tone === "wallet") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 010-4h14v4" /><path d="M3 5v14a2 2 0 002 2h16v-5" /><path d="M18 12a2 2 0 100 4h4v-4h-4z" /></svg>;
  if (tone === "agent") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="3" /><path d="M7 11V8" /><path d="M17 11V8" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 118 2.83" /><path d="M22 12A10 10 0 0012 2v10z" /></svg>;
}

export function QuickActionsWorkspace({ actions, onTriggerAction }: QuickActionsWorkspaceProps) {
  const [activeCategory, setActiveCategory] = useState<QuickActionCategory>("Calendar");
  const [activeModalLabel, setActiveModalLabel] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const categorized = useMemo(() => {
    return actions.reduce<Record<QuickActionCategory, QuickActionCard[]>>((acc, action) => {
      const category = resolveCategory(action);
      acc[category].push(action);
      return acc;
    }, {
      Capture: [],
      Trading: [],
      Decisions: [],
      Calendar: [],
      Wallet: [],
      Automation: [],
      Ops: [],
    });
  }, [actions]);

  const visibleActions = categorized[activeCategory].filter((action) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return action.label.toLowerCase().includes(q) || action.description.toLowerCase().includes(q);
  });
  const ActiveModal = activeModalLabel ? QUICK_ACTION_MODAL_MAP[activeModalLabel] : null;

  return (
    <>
      <div className="qa-shell">
        <aside className="qa-side">
          <div className="qa-side-search-wrap">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search quick actions..."
              className="qa-side-search"
            />
          </div>
          <div className="qa-side-title">Workspace</div>
          <div className="qa-side-list">
            {CATEGORY_ORDER.map((cat) => {
              const count = categorized[cat].length;
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`qa-cat ${active ? "is-active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="qa-cat-count">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="qa-main">
          <div className="qa-main-head">
            <span className="qa-col-title">Quick actions</span>
            <span className="qa-col-sub">{activeCategory}</span>
          </div>

          <div className="qa-actions-grid">
            {visibleActions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={`qa-action-card c-${action.tone}`}
                onClick={() => {
                  onTriggerAction(action.label);
                  setActiveModalLabel(action.label);
                }}
              >
                <div className="qa-ac-icon">
                  <ToneIcon tone={action.tone} />
                </div>
                <div className="qa-ac-body">
                  <span className="qa-ac-name">{action.label}</span>
                  <span className="qa-ac-desc">{action.description}</span>
                  <span className="qa-ac-shortcut">{action.hotkey}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <style jsx>{`
          .qa-shell {
            display: grid;
            grid-template-columns: 250px minmax(0, 1fr);
            gap: 10px;
          }
          .qa-side {
            background: transparent;
            border: 0;
            border-radius: 0;
            padding: 2px 6px 2px 2px;
          }
          .qa-side-search-wrap {
            margin: 1px 0 10px;
          }
          .qa-side-search {
            width: 100%;
            height: 34px;
            border: 1px solid rgba(200, 195, 230, 0.1);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.02);
            color: #b8b0d0;
            font-size: 12px;
            padding: 0 10px;
            outline: none;
          }
          .qa-side-search::placeholder {
            color: #7c74a1;
          }
          .qa-side-title,
          .qa-col-title {
            font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #8f88ad;
          }
          .qa-side-list {
            display: grid;
            gap: 2px;
            margin-top: 8px;
          }
          .qa-cat {
            min-height: 30px;
            border: 1px solid transparent;
            border-radius: 8px;
            background: transparent;
            color: #9f98be;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px 10px;
            cursor: pointer;
            transition: color 0.16s ease, background-color 0.16s ease, border-color 0.16s ease;
          }
          .qa-cat:hover {
            color: #d9d3ef;
            background: rgba(255, 255, 255, 0.02);
          }
          .qa-cat.is-active {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.1);
            color: #ede7ff;
          }
          .qa-cat-count {
            font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: 9px;
            color: #7c74a1;
            border: 1px solid rgba(200, 195, 230, 0.08);
            border-radius: 999px;
            min-width: 20px;
            height: 18px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
          }
          .qa-main {
            background: transparent;
            border: 0;
            padding: 0;
          }
          .qa-main-head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .qa-col-sub {
            font-size: 11px;
            color: #b8b0d0;
          }
          .qa-actions-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 6px;
          }
          .qa-action-card {
            display: flex;
            align-items: flex-start;
            gap: 9px;
            padding: 10px 11px;
            border: 1px solid rgba(200, 195, 230, 0.06);
            border-radius: 8px;
            background: #121127;
            color: #a8a1c3;
            cursor: pointer;
            text-align: left;
            transition: background-color 0.18s ease, border-color 0.18s ease, color 0.18s ease;
          }
          .qa-action-card:hover {
            background: #1a1a35;
            border-color: rgba(200, 195, 230, 0.13);
          }
          .qa-ac-icon {
            width: 30px;
            height: 30px;
            border-radius: 7px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(200, 195, 230, 0.06);
            flex-shrink: 0;
          }
          .qa-ac-icon svg {
            width: 13px;
            height: 13px;
          }
          .qa-action-card.c-note .qa-ac-icon { background: rgba(165, 148, 224, 0.1); color: #b590ff; }
          .qa-action-card.c-trade .qa-ac-icon { background: rgba(95, 186, 125, 0.1); color: #5fba7d; }
          .qa-action-card.c-decision .qa-ac-icon { background: rgba(201, 168, 76, 0.1); color: #c9a84c; }
          .qa-action-card.c-wallet .qa-ac-icon { background: rgba(95, 186, 125, 0.1); color: #5fba7d; }
          .qa-action-card.c-agent .qa-ac-icon { background: rgba(138, 138, 154, 0.08); color: #8a8a9a; }
          .qa-action-card.c-usage .qa-ac-icon { background: rgba(201, 168, 76, 0.1); color: #c9a84c; }
          .qa-ac-body {
            display: flex;
            flex-direction: column;
            gap: 1px;
            min-width: 0;
          }
          .qa-ac-name {
            font-size: 12px;
            font-weight: 600;
            color: #e8e8ec;
            line-height: 1.2;
          }
          .qa-ac-desc {
            font-size: 10px;
            color: #7c74a1;
            line-height: 1.25;
          }
          .qa-ac-shortcut {
            margin-top: 3px;
            font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: 8.5px;
            color: #7c74a1;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(200, 195, 230, 0.06);
            border-radius: 4px;
            padding: 1px 5px;
            width: fit-content;
          }
          @media (max-width: 1200px) {
            .qa-shell {
              grid-template-columns: 220px minmax(0, 1fr);
            }
            .qa-actions-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
          @media (max-width: 980px) {
            .qa-shell {
              grid-template-columns: 1fr;
            }
            .qa-actions-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>

      {ActiveModal ? <ActiveModal onClose={() => setActiveModalLabel(null)} /> : null}
    </>
  );
}
