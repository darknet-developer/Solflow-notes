type AiDockProps = {
  value: string;
  onChange: (value: string) => void;
  onAsk: () => void;
  onShortcut: (value: string) => void;
};

export function AiDock({ value, onChange, onAsk, onShortcut }: AiDockProps) {
  return (
    <div className="ai-bar">
      <div className="ai-avt">
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="#a594e0" strokeWidth="1.1" />
          <path d="M3.5 6.5c.5.8 3.5.8 4 0M4 5h.5M7 5h.5" stroke="#a594e0" strokeWidth=".9" strokeLinecap="round" />
        </svg>
      </div>
      <input
        className="ai-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            onAsk();
          }
        }}
        placeholder="Ask about this note, find patterns, or clean it up…"
      />
      <div className="ai-shortcuts">
        <button type="button" className="sc" onClick={() => onShortcut("summarise this note")}>
          summarise
        </button>
        <button type="button" className="sc" onClick={() => onShortcut("find patterns in my trades")}>
          patterns
        </button>
        <button type="button" className="sc" onClick={() => onShortcut("clean up this note")}>
          clean up
        </button>
      </div>
      <button type="button" className="ai-send" onClick={onAsk}>
        Ask ↗
      </button>
    </div>
  );
}
