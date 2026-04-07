"use client";

type CodeInsertBlockProps = {
  code: string;
  onChange: (next: string) => void;
  onRemove: () => void;
};

export function CodeInsertBlock({ code, onChange, onRemove }: CodeInsertBlockProps) {
  return (
    <section className="mt-5 rounded-[10px] border border-[var(--border2)] bg-[var(--bg2)] p-0">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)]">Typescript</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(code)}
            className="font-mono text-[10px] uppercase text-[var(--accent2)]"
          >
            Copy
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="font-mono text-[10px] uppercase text-[var(--text3)] hover:text-[var(--red)]"
          >
            Remove
          </button>
        </div>
      </div>
      <textarea
        value={code}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-[170px] w-full resize-y border-none bg-transparent px-4 py-4 font-mono text-[13px] leading-[1.75] text-[#cfd4ff] outline-none"
        placeholder="// write your code snippet"
      />
    </section>
  );
}

