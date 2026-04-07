import type { ReactNode } from "react";

type TradeCardProps = {
  pair: string;
  pnl: string;
  pnlSub: string;
  negative?: boolean;
  stats: Array<{
    label: string;
    value: string;
  }>;
  thesis: string;
};

export function TradeCard({ pair, pnl, pnlSub, negative = false, stats, thesis }: TradeCardProps) {
  return (
    <div className="trade-card">
      <div className="tc-head">
        <div className="tc-pair">{pair}</div>
        <div className="tc-pnl-block">
          <div className={`tc-pnl${negative ? " neg" : ""}`}>{pnl}</div>
          <div className="tc-pnl-sub">{pnlSub}</div>
        </div>
      </div>
      <div className="tc-grid">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="tc-stat-l">{stat.label}</div>
            <div className="tc-stat-v">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="tc-thesis">
        <div className="tc-thesis-l">Thesis</div>
        <div className="tc-thesis-t">{thesis}</div>
      </div>
    </div>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return <div className="callout">{children}</div>;
}

export function AiCard({ children }: { children: ReactNode }) {
  return (
    <div className="ai-card">
      <div className="ai-head">
        <div className="ai-badge-dot" />
        <span className="ai-badge">AI pattern insight</span>
      </div>
      <div className="ai-text">{children}</div>
    </div>
  );
}

export function CodeBlock({
  language,
  code,
  onCopy,
  copied,
}: {
  language: string;
  code: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="code-block">
      <div className="cb-head">
        <span className="cb-lang">{language}</span>
        <button type="button" className="cb-copy" onClick={onCopy}>
          {copied ? "copied!" : "copy"}
        </button>
      </div>
      <pre className="cb-body">{code}</pre>
    </div>
  );
}
