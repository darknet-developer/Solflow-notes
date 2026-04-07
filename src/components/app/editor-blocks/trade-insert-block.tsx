"use client";

import type { TradeTemplateBlock } from "@/types/editor-block";

type TradeInsertBlockProps = {
  trade: TradeTemplateBlock;
  onChange: (next: TradeTemplateBlock) => void;
  onRemove: () => void;
};

function updateField(
  trade: TradeTemplateBlock,
  key: keyof TradeTemplateBlock,
  value: string,
  onChange: (next: TradeTemplateBlock) => void,
) {
  onChange({ ...trade, [key]: value });
}

export function TradeInsertBlock({ trade, onChange, onRemove }: TradeInsertBlockProps) {
  return (
    <section className="trade-card mt-5">
      <div className="tc-head">
        <input
          value={trade.pair}
          onChange={(event) => updateField(trade, "pair", event.target.value, onChange)}
          className="tc-pair w-[180px] border-none bg-transparent outline-none"
          placeholder="SOL / USDC"
        />
        <button
          type="button"
          onClick={onRemove}
          className="font-mono text-[10px] uppercase text-[var(--text3)] hover:text-[var(--red)]"
        >
          Remove
        </button>
      </div>

      <div className="tc-grid">
        <label>
          <div className="tc-stat-l">Entry</div>
          <input
            value={trade.entry}
            onChange={(event) => updateField(trade, "entry", event.target.value, onChange)}
            className="tc-stat-v mt-1 w-full border-none bg-transparent outline-none"
            placeholder="$142.00"
          />
        </label>
        <label>
          <div className="tc-stat-l">Current</div>
          <input
            value={trade.current}
            onChange={(event) => updateField(trade, "current", event.target.value, onChange)}
            className="tc-stat-v mt-1 w-full border-none bg-transparent outline-none"
            placeholder="$159.60"
          />
        </label>
        <label>
          <div className="tc-stat-l">Invalidation</div>
          <input
            value={trade.invalidation}
            onChange={(event) => updateField(trade, "invalidation", event.target.value, onChange)}
            className="tc-stat-v mt-1 w-full border-none bg-transparent outline-none"
            placeholder="$135.00"
          />
        </label>
        <label>
          <div className="tc-stat-l">Conviction</div>
          <input
            value={trade.conviction}
            onChange={(event) => updateField(trade, "conviction", event.target.value, onChange)}
            className="tc-stat-v mt-1 w-full border-none bg-transparent outline-none"
            placeholder="8 / 10"
          />
        </label>
      </div>

      <div className="tc-thesis">
        <div className="tc-stat-l mb-2">Thesis</div>
        <textarea
          value={trade.thesis}
          onChange={(event) => updateField(trade, "thesis", event.target.value, onChange)}
          className="tc-thesis-t min-h-[88px] w-full resize-y border-none bg-transparent outline-none"
          placeholder="Write your trade thesis..."
        />
      </div>
    </section>
  );
}

