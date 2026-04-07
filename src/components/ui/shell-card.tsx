import type { ReactNode } from "react";

type ShellCardProps = {
  title: string;
  eyebrow?: string;
  children?: ReactNode;
};

export function ShellCard({ title, eyebrow, children }: ShellCardProps) {
  return (
    <section className="rounded-[28px] border border-white/5 bg-[#111120] p-6">
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7a7a8a]">{eyebrow}</p>
      ) : null}
      <h2 className="mt-3 font-serif text-2xl italic tracking-[-0.03em] text-[#ebebee]">{title}</h2>
      {children ? <div className="mt-4 text-sm leading-7 text-[#888898]">{children}</div> : null}
    </section>
  );
}
