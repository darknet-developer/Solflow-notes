"use client";

import { useMemo, useState } from "react";
import { RESOURCE_MODAL_MAP } from "@/components/app/resources/modals";

type ResourceTemplate = readonly [string, string];
type SecurityItem = readonly [string, string, string];
type ShortcutItem = readonly [string, string];

type ResourceCategory = "Getting Started" | "Templates" | "Security" | "Shortcuts";

type ResourcesWorkspaceProps = {
  docs: readonly string[];
  templates: readonly ResourceTemplate[];
  security: readonly SecurityItem[];
  shortcuts: readonly ShortcutItem[];
};

export function ResourcesWorkspace({
  docs,
  templates,
  security,
  shortcuts,
}: ResourcesWorkspaceProps) {
  const [activeCategory, setActiveCategory] = useState<ResourceCategory>("Getting Started");
  const [query, setQuery] = useState("");
  const [activeModalLabel, setActiveModalLabel] = useState<string | null>(null);

  const trimmedQuery = query.trim().toLowerCase();

  const filteredDocs = docs.filter((item) => item.toLowerCase().includes(trimmedQuery));
  const filteredTemplates = templates.filter(([name, description]) => {
    if (!trimmedQuery) return true;
    return name.toLowerCase().includes(trimmedQuery) || description.toLowerCase().includes(trimmedQuery);
  });
  const filteredSecurity = security.filter(([label, value]) => {
    if (!trimmedQuery) return true;
    return label.toLowerCase().includes(trimmedQuery) || value.toLowerCase().includes(trimmedQuery);
  });
  const filteredShortcuts = shortcuts.filter(([label, key]) => {
    if (!trimmedQuery) return true;
    return label.toLowerCase().includes(trimmedQuery) || key.toLowerCase().includes(trimmedQuery);
  });

  const categoryCounts = useMemo(
    () => ({
      "Getting Started": filteredDocs.length,
      Templates: filteredTemplates.length,
      Security: filteredSecurity.length,
      Shortcuts: filteredShortcuts.length,
    }),
    [filteredDocs.length, filteredTemplates.length, filteredSecurity.length, filteredShortcuts.length],
  );

  const ActiveModal = activeModalLabel ? RESOURCE_MODAL_MAP[activeModalLabel] : null;

  return (
    <>
      <div className="rs-shell">
        <aside className="rs-side">
          <div className="rs-side-search-wrap">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search resources..."
              className="rs-side-search"
            />
          </div>
          <div className="rs-side-title">Workspace</div>
          <div className="rs-side-list">
            {(Object.keys(categoryCounts) as ResourceCategory[]).map((cat) => (
              <button
                key={cat}
                type="button"
                className={`rs-cat ${activeCategory === cat ? "is-active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                <span>{cat}</span>
                <span className="rs-cat-count">{categoryCounts[cat]}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="rs-main">
          <div className="rs-main-head">
            <span className="rs-col-title">Resources</span>
            <span className="rs-col-sub">{activeCategory}</span>
          </div>

          <div className="rs-grid">
            {activeCategory === "Getting Started" &&
              filteredDocs.map((item) => (
                <button key={item} type="button" className="rs-card" onClick={() => setActiveModalLabel(item)}>
                  <div className="rs-card-top">
                    <span className="rs-name">{item}</span>
                    <span className="rs-pill">DOC</span>
                  </div>
                  <span className="rs-desc">Guide and reference content</span>
                </button>
              ))}

            {activeCategory === "Templates" &&
              filteredTemplates.map(([name, description], index) => (
                <button key={name} type="button" className="rs-card" onClick={() => setActiveModalLabel(name)}>
                  <div className="rs-card-top">
                    <span className="rs-name">{name}</span>
                    <span className="rs-pill">{index < 2 ? "FAST" : "TPL"}</span>
                  </div>
                  <span className="rs-desc">{description}</span>
                </button>
              ))}

            {activeCategory === "Security" &&
              filteredSecurity.map(([label, value, tone]) => (
                <button key={label} type="button" className="rs-card" onClick={() => setActiveModalLabel(label)}>
                  <div className="rs-card-top">
                    <span className="rs-name">{label}</span>
                    <span className={`rs-val ${tone === "ok" ? "ok" : ""}`}>{value}</span>
                  </div>
                  <span className="rs-desc">System safeguard and status</span>
                </button>
              ))}

            {activeCategory === "Shortcuts" &&
              filteredShortcuts.map(([label, key]) => (
                <button key={label} type="button" className="rs-card" onClick={() => setActiveModalLabel(label)}>
                  <div className="rs-card-top">
                    <span className="rs-name">{label}</span>
                    <span className="rs-key">{key}</span>
                  </div>
                  <span className="rs-desc">Keyboard workflow shortcut</span>
                </button>
              ))}
          </div>
        </section>

        <style jsx>{`
          .rs-shell {
            display: grid;
            grid-template-columns: 250px minmax(0, 1fr);
            gap: 10px;
          }
          .rs-side {
            background: transparent;
            border: 0;
            border-radius: 0;
            padding: 2px 6px 2px 2px;
          }
          .rs-side-search-wrap {
            margin: 1px 0 10px;
          }
          .rs-side-search {
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
          .rs-side-search::placeholder {
            color: #7c74a1;
          }
          .rs-side-title,
          .rs-col-title {
            font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: 9.5px;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #8f88ad;
          }
          .rs-side-list {
            display: grid;
            gap: 2px;
            margin-top: 8px;
          }
          .rs-cat {
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
          .rs-cat:hover {
            color: #d9d3ef;
            background: rgba(255, 255, 255, 0.02);
          }
          .rs-cat.is-active {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.1);
            color: #ede7ff;
          }
          .rs-cat-count {
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
          .rs-main {
            background: transparent;
            border: 0;
            padding: 0;
          }
          .rs-main-head {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          .rs-col-sub {
            font-size: 11px;
            color: #b8b0d0;
          }
          .rs-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 6px;
          }
          .rs-card {
            display: flex;
            flex-direction: column;
            gap: 2px;
            padding: 10px 11px;
            border: 1px solid rgba(200, 195, 230, 0.06);
            border-radius: 8px;
            background: #121127;
            color: #a8a1c3;
            cursor: pointer;
            text-align: left;
            transition: background-color 0.18s ease, border-color 0.18s ease;
          }
          .rs-card:hover {
            background: #1a1a35;
            border-color: rgba(200, 195, 230, 0.13);
          }
          .rs-card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
          }
          .rs-name {
            font-size: 12px;
            font-weight: 600;
            color: #e8e8ec;
            line-height: 1.2;
          }
          .rs-desc {
            font-size: 10px;
            color: #7c74a1;
            line-height: 1.25;
          }
          .rs-pill {
            font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: 8.5px;
            color: #b590ff;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(200, 195, 230, 0.1);
            border-radius: 4px;
            padding: 1px 5px;
          }
          .rs-key {
            font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
            font-size: 9px;
            color: #8f88ad;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(200, 195, 230, 0.1);
            border-radius: 4px;
            padding: 1px 6px;
          }
          .rs-val {
            font-size: 11px;
            color: #b8b0d0;
          }
          .rs-val.ok {
            color: #6db87a;
          }
          @media (max-width: 1200px) {
            .rs-shell {
              grid-template-columns: 220px minmax(0, 1fr);
            }
            .rs-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }
          @media (max-width: 980px) {
            .rs-shell {
              grid-template-columns: 1fr;
            }
            .rs-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>

      {ActiveModal ? <ActiveModal onClose={() => setActiveModalLabel(null)} /> : null}
    </>
  );
}
