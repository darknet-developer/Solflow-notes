import type { ReactNode } from "react";
import { AiCard, Callout, TradeCard } from "@/components/app/note-content-primitives";
import type { NoteRecord, NoteView } from "@/types/note";

export const VIEW_LABELS: Record<NoteView, string> = {
  home: "Home",
  all: "All notes",
  journal: "Trade journal",
  dev: "Dev notes",
  decisions: "Decision log",
  research: "Research",
};

export const NAV_VIEWS: Array<Exclude<NoteView, never>> = ["home", "all", "journal", "dev", "decisions", "research"];

export const NOTE_CONTENT: Record<string, ReactNode> = {
  "sol-long": (
    <>
      <TradeCard
        pair="SOL / USDC"
        pnl="+12.4%"
        pnlSub="+$684 unrealised"
        stats={[
          { label: "Entry", value: "$142.00" },
          { label: "Current", value: "$159.60" },
          { label: "Invalidation", value: "$135.00" },
          { label: "Conviction", value: "8 / 10" },
        ]}
        thesis="Firedancer mainnet announcement triggered breakout above the 200-day MA, a level capping price for 6 weeks. Network upgrade narrative is underpriced relative to ETH's merge premium. Position sized 15% given clear invalidation."
      />
      <h3>Pre-trade checklist</h3>
      <p>
        Emotional state: <strong>calm, high conviction</strong> and not FOMO. Checked similar
        past setups: 4/6 winners on confirmed MA breakout with catalyst. Avg hold 8 days. I
        typically exit too early, so I am setting a reminder at day 5 before touching the
        position.
      </p>
      <Callout>
        <strong>Rule:</strong> Do not reduce below 10% unless invalidation hits. Scale out at 20%
        minimum before reassessing.
      </Callout>
      <h3>Mid-trade notes</h3>
      <p>
        Day 2: holding. Small pullback to $150 but thesis intact, volume on the breakout was 3x
        average. Day 3: BTC dipped to 68k, noise only. Sitting on hands.
      </p>
      <AiCard>
        Your last 4 SOL trades show you exit an average of 2 days before your stated target. This
        trade is at day 3, which is the zone where you typically close early. Stated target: $175.
        Current: $159.60. Thesis intact, hold.
      </AiCard>
      <h3>Code snippet</h3>
      <p>
        Position sizing helper is parked below for quick reuse while the setup is still in play.
      </p>
    </>
  ),
  "jto-short": (
    <>
      <TradeCard
        pair="JTO / USDC"
        pnl="-4.2%"
        pnlSub="-$118 closed"
        negative
        stats={[
          { label: "Entry", value: "$2.80" },
          { label: "Exit", value: "$2.92" },
          { label: "Stop", value: "$3.10" },
          { label: "Conviction", value: "5 / 10" },
        ]}
        thesis="TVL declining 3 consecutive weeks. Governance token, no near-term catalyst. BTC correlation high. Expected mean reversion."
      />
      <h3>Post-mortem</h3>
      <p>
        Stopped out at $2.92 before the reversal. Thesis was correct and JTO eventually dropped to
        $2.40, but size was too tight and I got shaken out by a BTC pump. Low conviction going in
        showed up in the stop placement.
      </p>
      <Callout>
        <strong>Lesson:</strong> Conviction below 6/10 means either skip or keep size to 2% max
        with a wider stop. Tight stops on low conviction is the worst combination.
      </Callout>
      <AiCard>
        This is your 3rd trade in a row below 6/10 conviction that lost. Your win rate above 7/10
        is 71%. Below 6 is 22%. The data says skip anything under 7.
      </AiCard>
    </>
  ),
  "wif-scalp": (
    <>
      <TradeCard
        pair="WIF / USDC"
        pnl="+28.1%"
        pnlSub="+$461 closed"
        stats={[
          { label: "Entry", value: "$0.82" },
          { label: "Exit", value: "$1.05" },
          { label: "Invalidation", value: "$0.74" },
          { label: "Size", value: "3% book" },
        ]}
        thesis="2-week low-vol compression. BTC holding 70k. Early rotation signals in memecoins. Small size, asymmetric upside."
      />
      <h3>Trade review</h3>
      <p>
        Clean setup, clean execution. Entered on compression breakout and kept the size small.
        Exited at 28% target, which was correct in hindsight given the reversal after.
      </p>
      <AiCard>
        This matches your compression breakout template: 67% win rate across 9 trades. Average
        hold is 2.3 days. You followed your rules, which is why this remains your most reliable
        setup.
      </AiCard>
    </>
  ),
  "helius-rpc": (
    <>
      <p>
        Helius free tier caps at 10 req/s per method. I am hitting that on <code>getAccountInfo</code>{" "}
        during high-activity windows. Need proper backoff plus fallback before mainnet.
      </p>
      <h3>Strategy</h3>
      <p>
        Exponential backoff starting at 200ms, max 3 retries. On all retries failing, fall back to
        QuickNode. Add node health check on startup and do not let the app start silently broken.
      </p>
      <h3>Fallback config</h3>
      <p>
        Primary: Helius. Fallback: QuickNode. Both keyed via env vars. Consider Triton for
        production at scale.
      </p>
      <Callout>
        <strong>Note:</strong> QuickNode free tier also has limits. Monitor both dashboards.
      </Callout>
    </>
  ),
  "solana-decision": (
    <>
      <p>
        Evaluated Solana vs Base vs Ethereum mainnet for the proof and notarization layer. Decision:
        <strong> Solana.</strong>
      </p>
      <h3>Why Solana</h3>
      <p>
        Fees are effectively zero for simple memo and hash writes. Finality is fast enough that
        notarizing a note feels instant. The ecosystem also has the right culture for the product:
        builders, traders, and people who actually use crypto daily.
      </p>
      <p>
        The <code>spl-memo</code> program is exactly what we need. Write arbitrary data to chain,
        keep it permanent and verifiable, and avoid shipping a custom smart contract too early.
      </p>
      <h3>Why not Base</h3>
      <p>
        Base is fine, but the cultural fit is weaker and the fee profile is still not Solana-low.
        The product identity is better aligned with Solana from both a UX and brand perspective.
      </p>
      <Callout>
        <strong>Decision:</strong> Solana mainnet for proof. Helius for RPC. Phantom and Backpack
        for wallet connect. Revisit in 6 months.
      </Callout>
      <AiCard>
        You made 4 infrastructure decisions this month and 3 of 4 leaned into Solana tooling. The
        ecosystem bet is now consistent, which lowers cognitive overhead on future calls.
      </AiCard>
    </>
  ),
};

export const MOCK_NOTES: NoteRecord[] = [
  {
    id: "sol-long",
    view: "journal",
    filters: ["all", "open", "notarized"],
    title: "SOL long — Firedancer thesis",
    date: "28 Mar",
    preview: "Breakout above 200d MA post-Firedancer announcement. Conviction 8/10.",
    tags: [
      { label: "+12.4%", tone: "green" },
      { label: "SOL/USDC", tone: "dim" },
    ],
    proof: true,
    notarized: true,
    hash: "3xF9aK2mR7qNpL4vBc8dY1eHjW6tUs0iZoX5nMgA",
    slot: "312,884,441",
    slotDate: "28 Mar 2026",
    meta: {
      Pair: "SOL / USDC",
      Entry: "$142.00",
      PnL: "+12.4%",
      Status: "open",
      Words: "312",
      Created: "28 Mar 2026",
      Modified: "Today, 14:22",
      Folder: "Trade journal",
    },
    related: [
      { title: "WIF scalp — memecoin cycle", match: "same cycle · 2 shared tags" },
      { title: "Solana ecosystem overview", match: "mentions Firedancer" },
      { title: "BONK thesis — graveyard", match: "similar entry pattern" },
    ],
    contentKey: "sol-long",
  },
  {
    id: "jto-short",
    view: "journal",
    filters: ["all", "closed"],
    title: "JTO short — TVL decline",
    date: "24 Mar",
    preview: "Governance token, TVL declining 3 weeks. Entry $2.80, stop $3.10.",
    tags: [
      { label: "-4.2%", tone: "red" },
      { label: "JTO/USDC", tone: "dim" },
    ],
    proof: false,
    notarized: false,
    meta: {
      Pair: "JTO / USDC",
      Entry: "$2.80",
      PnL: "-4.2%",
      Status: "closed",
      Words: "189",
      Created: "24 Mar 2026",
      Modified: "26 Mar 2026",
      Folder: "Trade journal",
    },
    related: [
      { title: "SOL long — Firedancer thesis", match: "same period" },
      { title: "BONK thesis — graveyard", match: "similar short setup" },
    ],
    contentKey: "jto-short",
  },
  {
    id: "wif-scalp",
    view: "journal",
    filters: ["all", "closed", "notarized"],
    title: "WIF scalp — memecoin cycle",
    date: "20 Mar",
    preview: "Compression breakout. BTC holding 70k. 3% book, asymmetric upside.",
    tags: [
      { label: "+28.1%", tone: "green" },
      { label: "notarized", tone: "accent" },
    ],
    proof: true,
    notarized: true,
    hash: "8mVw3Kp9xZnQtL2dB5fRjY4cUe7sNiHo6aGk1Xv0",
    slot: "311,204,819",
    slotDate: "20 Mar 2026",
    meta: {
      Pair: "WIF / USDC",
      Entry: "$0.82",
      PnL: "+28.1%",
      Status: "closed",
      Words: "145",
      Created: "20 Mar 2026",
      Modified: "22 Mar 2026",
      Folder: "Trade journal",
    },
    related: [
      { title: "SOL long — Firedancer thesis", match: "same memecoin cycle" },
      { title: "BONK thesis — graveyard", match: "same setup, different outcome" },
    ],
    contentKey: "wif-scalp",
  },
  {
    id: "helius-rpc",
    view: "dev",
    filters: ["all"],
    title: "Helius RPC — rate limit notes",
    date: "yesterday",
    preview: "Handling 429s with exponential backoff + QuickNode fallback.",
    tags: [
      { label: "dev", tone: "accent" },
      { label: "rpc", tone: "dim" },
    ],
    proof: false,
    notarized: false,
    meta: {
      Folder: "Dev notes",
      Words: "220",
      Created: "28 Mar 2026",
      Modified: "Today, 09:14",
    },
    related: [
      { title: "SOL long — Firedancer thesis", match: "same codebase" },
      { title: "Choosing Solana over Base", match: "follows from this decision" },
    ],
    contentKey: "helius-rpc",
  },
  {
    id: "solana-decision",
    view: "decisions",
    filters: ["all"],
    title: "Choosing Solana over Base",
    date: "15 Mar",
    preview: "Why Solana for the proof layer. Speed, fees, culture, and ecosystem fit.",
    tags: [
      { label: "decision", tone: "accent" },
      { label: "infra", tone: "dim" },
    ],
    proof: false,
    notarized: false,
    meta: {
      Folder: "Decision log",
      Words: "310",
      Created: "15 Mar 2026",
      Modified: "15 Mar 2026",
    },
    related: [
      { title: "Helius RPC — rate limit notes", match: "follows from this" },
      { title: "SOL long — Firedancer thesis", match: "same ecosystem bet" },
    ],
    contentKey: "solana-decision",
  },
];
