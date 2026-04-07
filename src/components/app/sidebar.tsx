import { useEffect, useState } from "react";
import { NAV_VIEWS, VIEW_LABELS } from "@/lib/mock-notes";
import type { NoteId, NoteRecord, NoteView } from "@/types/note";

type SidebarProps = {
  collapsed: boolean;
  activeView: NoteView;
  activeNoteId: NoteId | null;
  notes: NoteRecord[];
  search: string;
  onSearchChange: (value: string) => void;
  onCollapse: () => void;
  onNewNote: () => void;
  onSelectView: (view: NoteView) => void;
  onSelectNote: (id: NoteId) => void;
};

function ViewIcon({ view }: { view: NoteView }) {
  if (view === "home") {
    return (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
        <path
          d="M2.5 7L8 2.5 13.5 7V13a1 1 0 01-1 1H10v-3.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5V14H3.5a1 1 0 01-1-1V7z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (view === "all") {
    return (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  if (view === "journal") {
    return (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
        <polyline
          points="2,12 5,6 8,9 10.5,5 14,2"
          stroke="currentColor"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="11,2 14,2 14,5"
          stroke="currentColor"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (view === "dev") {
    return (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
        <path
          d="M5 4.5L2 8l3 3.5M11 4.5l3 3.5-3 3.5"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (view === "decisions") {
    return (
      <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 5v3.5l2.2 1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg className="nav-icon" viewBox="0 0 16 16" fill="none">
      <rect x="2.5" y="2" width="11" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 5.5h5M5.5 8h3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function PinCollapsedIcon({ noteId }: { noteId: NoteId }) {
  if (noteId === "sol-long") {
    return (
      <svg className="pin-icon-c" viewBox="0 0 16 16" fill="none">
        <polyline
          points="2,12 5,6 8,9 10.5,5 14,2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg className="pin-icon-c" viewBox="0 0 16 16" fill="none">
      <polyline
        points="2,4 5,10 8,7 10.5,11 14,14"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sidebar({
  collapsed,
  activeView,
  activeNoteId,
  notes,
  search,
  onSearchChange,
  onCollapse,
  onNewNote,
  onSelectView,
  onSelectNote,
}: SidebarProps) {
  const pinned = notes.slice(0, 2);
  const [expandedPins, setExpandedPins] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (collapsed) {
      setExpandedPins({});
    }
  }, [collapsed]);

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      <div className="sidebar-scroll">
        <div className="sb-head">
          <div className="logo">
            
            <button type="button" className="collapse-btn collapse-top-only" title="Toggle sidebar" onClick={onCollapse}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M7 2L4 5.5 7 9"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="action-row">
            <button type="button" className="new-note-sq" title="New note" onClick={onNewNote}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
            <div className="search-wrap">
              <svg className="s-icon" width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="5.5" cy="5.5" r="3.8" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8.5 8.5L11 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search..." />
              <span className="search-shortcut hide-c">Cmd K</span>
            </div>
            <button type="button" className="collapse-btn collapse-inline" title="Toggle sidebar" onClick={onCollapse}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path
                  d="M7 2L4 5.5 7 9"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="pre-nav-divider" />

        <div className="sb-section">
          <span className="sec-label hide-c">Workspace</span>
          <span className="sec-line hide-c" />
        </div>

        <div className="nav-group">
          {NAV_VIEWS.map((view) => {
            const count =
              view === "home" ? "" : view === "all" ? notes.length : notes.filter((note) => note.view === view).length;

            return (
              <button
                key={view}
                type="button"
                className={`nav-item${activeView === view ? " active" : ""}`}
                onClick={() => onSelectView(view)}
                title={VIEW_LABELS[view]}
              >
                <ViewIcon view={view} />
                <span className="sb-label hide-c">{VIEW_LABELS[view]}</span>
                {view === "home" ? null : <span className="nav-count hide-c">{count}</span>}
              </button>
            );
          })}
        </div>

        <div className="c-divider" />

        <div className="pinned-list">
          <div className="sb-section">
            <span className="sec-label hide-c">Pinned</span>
            <span className="sec-line hide-c" />
          </div>

          <div className="pinned-cards">
            {pinned.map((note) => {
              const expanded = Boolean(expandedPins[note.id]);
              const pnl = note.tags.find((tag) => tag.tone === "green" || tag.tone === "red")?.label ?? "";
              const pair = note.tags.find((tag) => tag.tone === "dim")?.label ?? "";

              return (
                <button
                  key={note.id}
                  type="button"
                  className={`pin-item${expanded ? " expanded" : ""}`}
                  data-pin
                  title={note.title}
                  onClick={() => {
                    if (!collapsed) {
                      setExpandedPins((current) => ({ ...current, [note.id]: !current[note.id] }));
                    }
                    onSelectNote(note.id);
                  }}
                >
                  <div className="pin-row">
                    <svg className="pin-chevron hide-c" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M4.5 2.5L8 6l-3.5 3.5"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <PinCollapsedIcon noteId={note.id} />
                    <span className="pin-title hide-c">{note.title}</span>
                    <div className="pin-meta hide-c">
                      <span className={`pin-pnl ${pnl.startsWith("-") ? "neg" : "pos"}`}>{pnl}</span>
                    </div>
                  </div>

                  <div className="pin-expand">
                    <div className="pin-desc">{note.preview}</div>
                    <div className="pin-detail-row">
                      <span className="pin-pair">{pair}</span>
                      <span className="pin-date">{note.date}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="sb-footer">
        <div className="sb-footer-inner">
          <div className="footer-row" title="Connected">
            <div className="wallet-dot" />
            <span className="footer-label hide-c">Connected</span>
          </div>
          <div className="footer-row clickable" title="7xK2...f9Rq - Copy address">
            <svg className="footer-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 010-4h14v4" />
              <path d="M3 5v14a2 2 0 002 2h16v-5" />
              <path d="M18 12a2 2 0 100 4h4v-4h-4z" />
            </svg>
            <span className="footer-label hide-c">7xK2...f9Rq</span>
            <svg className="footer-copy hide-c" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </div>
          <div className="footer-row credits-row" title="AI credits: 12.40 SOL">
            <svg className="footer-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12M15 9.5a3 3 0 00-3-2.5H9.5a3 3 0 000 5H14a3 3 0 010 5H9a3 3 0 01-3-2.5" />
            </svg>
            <span className="footer-label hide-c">AI credits</span>
            <span className="footer-val amber hide-c">12.40 SOL</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
