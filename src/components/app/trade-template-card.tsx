"use client";

type TradeTemplate = {
  pair: string;
  entry: string;
  current: string;
  invalidation: string;
  conviction: string;
  thesis: string;
};

type TradeTemplateCardProps = {
  value: TradeTemplate;
  onChange: (value: TradeTemplate) => void;
};

function updateField(
  value: TradeTemplate,
  key: keyof TradeTemplate,
  next: string,
  onChange: (value: TradeTemplate) => void,
) {
  onChange({ ...value, [key]: next });
}

export function TradeTemplateCard({ value, onChange }: TradeTemplateCardProps) {
  return (
    <div className="mt-5 rounded-xl border border-white/15 bg-[#0d1326] p-4">
      <div className="flex items-center justify-between gap-3">
        <input
          value={value.pair}
          onChange={(event) => updateField(value, "pair", event.target.value, onChange)}
          className="w-[220px] border-0 bg-transparent font-serif text-3xl tracking-[-0.02em] text-[#f1f5ff] outline-none placeholder:text-[#5f6a8d]"
          placeholder="SOL / USDC"
        />
        <p className="text-sm font-medium text-[#64d68a]">Trading template</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label className="rounded-lg border border-white/10 bg-[#0a1122] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6f7ca3]">Entry</p>
          <input
            value={value.entry}
            onChange={(event) => updateField(value, "entry", event.target.value, onChange)}
            className="mt-2 w-full border-0 bg-transparent text-lg font-medium text-[#e4ecff] outline-none"
            placeholder="$142.00"
          />
        </label>

        <label className="rounded-lg border border-white/10 bg-[#0a1122] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6f7ca3]">Current</p>
          <input
            value={value.current}
            onChange={(event) => updateField(value, "current", event.target.value, onChange)}
            className="mt-2 w-full border-0 bg-transparent text-lg font-medium text-[#e4ecff] outline-none"
            placeholder="$159.60"
          />
        </label>

        <label className="rounded-lg border border-white/10 bg-[#0a1122] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6f7ca3]">Invalidation</p>
          <input
            value={value.invalidation}
            onChange={(event) => updateField(value, "invalidation", event.target.value, onChange)}
            className="mt-2 w-full border-0 bg-transparent text-lg font-medium text-[#e4ecff] outline-none"
            placeholder="$135.00"
          />
        </label>

        <label className="rounded-lg border border-white/10 bg-[#0a1122] p-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6f7ca3]">Conviction</p>
          <input
            value={value.conviction}
            onChange={(event) => updateField(value, "conviction", event.target.value, onChange)}
            className="mt-2 w-full border-0 bg-transparent text-lg font-medium text-[#e4ecff] outline-none"
            placeholder="8 / 10"
          />
        </label>
      </div>

      <label className="mt-4 block rounded-lg border border-white/10 bg-[#0a1122] p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#6f7ca3]">Thesis</p>
        <textarea
          value={value.thesis}
          onChange={(event) => updateField(value, "thesis", event.target.value, onChange)}
          className="mt-2 h-24 w-full resize-none border-0 bg-transparent text-sm leading-7 text-[#d3dcfb] outline-none placeholder:text-[#5f6a8d]"
          placeholder="Write your trade thesis..."
        />
      </label>
    </div>
  );
}

