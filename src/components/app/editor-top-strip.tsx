import type { ReactNode } from "react";

type EditorTopStripProps = {
  viewLabel: string;
  title: string;
  panelHidden: boolean;
  detailsHidden: boolean;
  notarized: boolean;
  onTogglePanel: () => void;
  onToggleDetails: () => void;
  onShare: () => void;
  onToggleAgent: () => void;
  textTools: ReactNode;
  blockTools: ReactNode;
  mediaTools: ReactNode;
};

export function EditorTopStrip({
  viewLabel,
  title,
  panelHidden,
  detailsHidden,
  notarized,
  onTogglePanel,
  onToggleDetails,
  onShare,
  onToggleAgent,
  textTools,
  blockTools,
  mediaTools,
}: EditorTopStripProps) {
  return (
    <div className="editor-strip">
      <div className="strip-head">
        <div className="breadcrumb">
          <span>{viewLabel}</span>
          <span className="bc-sep">/</span>
          <span>{title}</span>
        </div>
        <div className="ed-actions">
          <button
            type="button"
            className={`tb-icon${panelHidden ? " active" : ""}`}
            onClick={onTogglePanel}
            title="Toggle list"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="5" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <rect x="8" y="1" width="4" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          <button
            type="button"
            className={`tb-icon${detailsHidden ? " active" : ""}`}
            onClick={onToggleDetails}
            title="Toggle details"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="4" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <rect x="7" y="1" width="5" height="11" rx="1" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          {notarized ? (
            <div className="notarized-pill">
              <div className="np-dot" />
              notarized on-chain
            </div>
          ) : null}
          <button type="button" className="act-btn" onClick={onShare}>
            Share
          </button>
          <button type="button" className="act-btn primary" onClick={onToggleAgent}>
            Agent
          </button>
        </div>
      </div>
      <div className="toolbar-group left" aria-label="Text tools">
        {textTools}
      </div>
      <div className="toolbar-group mid" aria-label="Structured blocks">
        {blockTools}
      </div>
      <div className="toolbar-group right" aria-label="Export and media">
        {mediaTools}
      </div>
    </div>
  );
}
