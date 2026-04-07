type AgentPopupBarProps = {
  value: string;
  onChange: (value: string) => void;
  onAsk: () => void;
  onShortcut: (value: string) => void;
  onClose: () => void;
};

export function AgentPopupBar({ value, onChange, onAsk, onShortcut, onClose }: AgentPopupBarProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-5">
      <div className="pointer-events-auto flex w-full max-w-[1180px] items-center gap-2 rounded-3xl border border-[var(--border2)] bg-[rgba(10,10,18,0.94)] px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <button
          type="button"
          onClick={onClose}
          className="h-8 w-8 rounded-full border border-[var(--border)] text-[var(--text3)] hover:text-[var(--text2)]"
          title="Close agent"
        >
          ×
        </button>
        <input
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] px-4 py-2.5 text-sm text-[var(--text2)] outline-none placeholder:text-[var(--text3)] focus:border-[var(--border2)]"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onAsk();
            }
          }}
          placeholder="Ask about this note, find patterns, or clean it up..."
        />
        <button
          type="button"
          className="sc"
          onClick={() => onShortcut("summarise this note")}
        >
          summarise
        </button>
        <button
          type="button"
          className="sc"
          onClick={() => onShortcut("find patterns in my trades")}
        >
          patterns
        </button>
        <button
          type="button"
          className="sc"
          onClick={() => onShortcut("clean up this note")}
        >
          clean up
        </button>
        <button
          type="button"
          className="rounded-xl border border-[rgba(165,148,224,.22)] bg-[var(--accent-d)] px-5 py-2.5 text-sm font-medium text-[var(--accent2)]"
          onClick={onAsk}
        >
          Ask ↗
        </button>
      </div>
    </div>
  );
}
