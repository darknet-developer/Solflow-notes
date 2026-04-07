import { VIEW_LABELS } from "@/lib/mock-notes";
import type { NoteFilter, NoteId, NoteRecord, NoteView } from "@/types/note";

type NotesPanelProps = {
  hidden: boolean;
  activeView: NoteView;
  activeFilter: NoteFilter;
  compactView: boolean;
  activeNoteId: NoteId | null;
  notes: NoteRecord[];
  onToggleCompact: (value: boolean) => void;
  onSelectFilter: (filter: NoteFilter) => void;
  onSelectNote: (id: NoteId) => void;
};

const filters: NoteFilter[] = ["all", "open", "closed", "notarized"];

const chipToneClass: Record<string, string> = {
  accent: "chip-p",
  green: "chip-g",
  red: "chip-r",
  dim: "chip-d",
};

export function NotesPanel({
  hidden,
  activeView,
  activeFilter,
  compactView,
  activeNoteId,
  notes,
  onToggleCompact,
  onSelectFilter,
  onSelectNote,
}: NotesPanelProps) {
  return (
    <div className={`panel${hidden ? " hidden" : ""}`}>
      <div className="panel-head">
        <span className="panel-title">{VIEW_LABELS[activeView]}</span>
        <div className="panel-acts">
          <button type="button" className={`icon-btn${compactView ? "" : " on"}`} onClick={() => onToggleCompact(false)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 3h10M1 6h10M1 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className={`icon-btn${compactView ? " on" : ""}`} onClick={() => onToggleCompact(true)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4.5" height="4.5" rx=".8" fill="currentColor" opacity=".6" />
              <rect x="6.5" y="1" width="4.5" height="4.5" rx=".8" fill="currentColor" opacity=".6" />
              <rect x="1" y="6.5" width="4.5" height="4.5" rx=".8" fill="currentColor" opacity=".6" />
              <rect x="6.5" y="6.5" width="4.5" height="4.5" rx=".8" fill="currentColor" opacity=".6" />
            </svg>
          </button>
        </div>
      </div>
      {activeView === "journal" ? (
        <div className="panel-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`fchip${activeFilter === filter ? " active" : ""}`}
              onClick={() => onSelectFilter(filter)}
            >
              {filter === "all" ? "All" : filter[0].toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>
      ) : null}
      <div className="panel-list">
        {notes.length ? (
          notes.map((note) => (
            <button
              key={note.id}
              type="button"
              className={`pnote${activeNoteId === note.id ? " active" : ""}`}
              onClick={() => onSelectNote(note.id)}
            >
              <div className="pn-head">
                <div className="pn-title">{note.title}</div>
                <div className="pn-date">{note.date}</div>
              </div>
              <div className="pn-prev">{note.preview}</div>
              <div className="pn-foot">
                <div className="pn-tags">
                  {note.tags.map((tag) => (
                    <span key={`${note.id}-${tag.label}`} className={`chip ${chipToneClass[tag.tone]}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>
                {note.proof ? (
                  <div className="pn-proof">
                    <div className="proof-dot" />
                    on-chain
                  </div>
                ) : null}
              </div>
            </button>
          ))
        ) : (
          <div className="panel-empty">No notes match this filter.</div>
        )}
      </div>
    </div>
  );
}
