import type { NoteRecord } from "@/types/note";

type DetailsTab = "info" | "linked" | "chain";

type DetailsPanelProps = {
  hidden: boolean;
  activeTab: DetailsTab;
  note: NoteRecord | null;
  onClose: () => void;
  onChangeTab: (tab: DetailsTab) => void;
  onToast: (message: string) => void;
};

export function DetailsPanel({
  hidden,
  activeTab,
  note,
  onClose,
  onChangeTab,
  onToast,
}: DetailsPanelProps) {
  const metaEntries = note ? Object.entries(note.meta) : [];

  return (
    <div className={`rp${hidden ? " hidden" : ""}`}>
      <div className="rp-head">
        <span className="rp-head-title">Details</span>
        <button type="button" className="rp-close" onClick={onClose}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="rp-tabs">
        {(["info", "linked", "chain"] as DetailsTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            className={`rp-tab${activeTab === tab ? " active" : ""}`}
            onClick={() => onChangeTab(tab)}
          >
            {tab === "chain" ? "On-chain" : tab[0].toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="rp-body">
        {activeTab === "info" ? (
          note ? (
            <>
              {metaEntries.map(([key, value]) => {
                const green = (key === "PnL" && String(value).startsWith("+")) || (key === "Status" && value === "open");
                const red = key === "PnL" && String(value).startsWith("-");
                return (
                  <div key={key} className="info-row">
                    <span className="il">{key}</span>
                    <span className={`iv mono${green ? " green" : red ? " red" : ""}`}>{value}</span>
                  </div>
                );
              })}
              <div className="rp-div" />
              <div className="rp-sec-label">Related notes</div>
              {note.related.map((relation) => (
                <div key={relation.title} className="rel-note">
                  <div className="rel-title">{relation.title}</div>
                  <div className="rel-match">{relation.match}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="details-empty">No note selected yet.</div>
          )
        ) : null}

        {activeTab === "linked" ? (
          note?.related.length ? (
            <>
              <div className="rp-sec-label linked-heading">Semantic connections</div>
              {note.related.map((relation) => (
                <div key={relation.title} className="rel-note">
                  <div className="rel-title">{relation.title}</div>
                  <div className="rel-match">{relation.match}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="details-empty">
              No connections yet.
              <br />
              AI will surface them as you write more.
            </div>
          )
        ) : null}

        {activeTab === "chain" ? (
          note?.notarized ? (
            <>
              <div className="chain-card">
                <div className="chain-head">
                  <div className="chain-dot" />
                  Notarized on Solana
                </div>
                <div className="hash-box">{note.hash}</div>
                <div className="chain-meta">
                  <span>slot #{note.slot}</span>
                  <span>{note.slotDate}</span>
                </div>
              </div>
              <div className="chain-note">
                Note content is private. Only the hash lives on-chain, proving this thesis existed
                before the move without exposing the edge.
              </div>
              <button type="button" className="chain-btn" onClick={() => onToast("Opening Solscan…")}>
                View on Solscan ↗
              </button>
            </>
          ) : (
            <>
              <div className="notarize-prompt">
                This note is not notarized yet. Storing a hash on Solana proves it existed at this
                date without revealing the content.
              </div>
              <div className="notarize-cost">
                <span>Cost to notarize</span>
                <strong>~0.000005 SOL</strong>
              </div>
              <button type="button" className="notarize-btn" onClick={() => onToast("Requesting wallet signature…")}>
                Notarize this note
              </button>
            </>
          )
        ) : null}
      </div>
    </div>
  );
}
