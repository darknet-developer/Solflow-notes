import { useMemo, useRef } from "react";
import { AgentPopupBar } from "@/components/app/agent-popup-bar";
import { CodeInsertBlock } from "@/components/app/editor-blocks/code-insert-block";
import { TradeInsertBlock } from "@/components/app/editor-blocks/trade-insert-block";
import { CodeBlock } from "@/components/app/note-content-primitives";
import { NOTE_CONTENT, VIEW_LABELS } from "@/lib/mock-notes";
import type { DraftEditorBlock, TradeTemplateBlock } from "@/types/editor-block";
import type { NoteRecord } from "@/types/note";

type NoteEditorProps = {
  note: NoteRecord | null;
  title: string;
  draftBody: string;
  draftBlocks: DraftEditorBlock[];
  panelHidden: boolean;
  detailsHidden: boolean;
  toolbarActive: number[];
  copiedCode: boolean;
  aiValue: string;
  agentOpen: boolean;
  onTogglePanel: () => void;
  onToggleDetails: () => void;
  onToggleAgent: () => void;
  onTitleChange: (value: string) => void;
  onDraftBodyChange: (value: string) => void;
  onInsertCodeBlock: () => void;
  onInsertTradeBlock: () => void;
  onCodeBlockChange: (blockId: string, code: string) => void;
  onTradeBlockChange: (blockId: string, trade: TradeTemplateBlock) => void;
  onRemoveBlock: (blockId: string) => void;
  onToggleToolbar: (index: number) => void;
  onShare: () => void;
  onCopyCode: () => void;
  onAiChange: (value: string) => void;
  onAskAi: () => void;
  onAiShortcut: (value: string) => void;
};

export function NoteEditor({
  note,
  title,
  draftBody,
  draftBlocks,
  panelHidden,
  detailsHidden,
  toolbarActive,
  copiedCode,
  aiValue,
  agentOpen,
  onTogglePanel,
  onToggleDetails,
  onToggleAgent,
  onTitleChange,
  onDraftBodyChange,
  onInsertCodeBlock,
  onInsertTradeBlock,
  onCodeBlockChange,
  onTradeBlockChange,
  onRemoveBlock,
  onToggleToolbar,
  onShare,
  onCopyCode,
  onAiChange,
  onAskAi,
  onAiShortcut,
}: NoteEditorProps) {
  const draftTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const noteContent = note ? NOTE_CONTENT[note.contentKey] : null;

  const applyInlineFormat = (item: string) => {
    if (note) {
      return;
    }

    const textarea = draftTextareaRef.current;
    if (!textarea) {
      return;
    }

    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    const selectedText = draftBody.slice(selectionStart, selectionEnd);

    const wrappers: Record<string, { prefix: string; suffix: string }> = {
      B: { prefix: "**", suffix: "**" },
      I: { prefix: "*", suffix: "*" },
      U: { prefix: "<u>", suffix: "</u>" },
    };

    const wrapper = wrappers[item];
    if (!wrapper) {
      return;
    }

    const hasSelection = selectionStart !== selectionEnd;
    const content = hasSelection ? selectedText : "text";
    const replacement = `${wrapper.prefix}${content}${wrapper.suffix}`;
    const nextBody = `${draftBody.slice(0, selectionStart)}${replacement}${draftBody.slice(selectionEnd)}`;

    onDraftBodyChange(nextBody);

    requestAnimationFrame(() => {
      const nextCursorStart = selectionStart + wrapper.prefix.length;
      const nextCursorEnd = hasSelection ? nextCursorStart + content.length : nextCursorStart + 4;
      textarea.focus();
      textarea.setSelectionRange(nextCursorStart, nextCursorEnd);
    });
  };

  const codeBlock = useMemo(() => {
    if (note?.id === "sol-long") {
      return `// Position size — 15% book at $142
const calcPos = (book: number, pct: number, entry: number) => ({
  usdc: book * (pct / 100),
  tokens: (book * pct / 100) / entry,
  risk: (book * pct / 100) * 0.049,
})`;
    }

    if (note?.id === "helius-rpc") {
      return `async function fetchWithBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 200
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (e: any) {
      if (e?.status !== 429 || i === retries - 1) throw e
      await sleep(delay * (2 ** i))
    }
  }
}`;
    }

    return null;
  }, [note]);

  return (
    <div className="editor">
      <div className="editor-topbar">
        <div className="breadcrumb">
          <span>{note ? VIEW_LABELS[note.view] : "Trade journal"}</span>
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
          {note?.notarized ? (
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

      <div className="toolbar">
        {["B", "I", "U", "H1", "H2", "LIST", "CODE", "PDF", "IMG", "TRADE"].map((item, index) => (
          <button
            key={item}
            type="button"
            className={`tb-btn${toolbarActive.includes(index) ? " on" : ""}`}
            onClick={() => {
              if (item === "CODE") {
                onInsertCodeBlock();
                return;
              }
              if (item === "TRADE") {
                onInsertTradeBlock();
                return;
              }
              if (item === "B" || item === "I" || item === "U") {
                applyInlineFormat(item);
              }
              onToggleToolbar(index);
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="ed-body">
        <input className="note-title" value={title} onChange={(event) => onTitleChange(event.target.value)} />
        <div className="note-meta">
          {note?.meta.Created ? <div className="meta-item">{note.meta.Created}</div> : null}
          {note?.meta.Folder ? (
            <>
              <div className="meta-sep" />
              <div className="meta-item">{note.meta.Folder}</div>
            </>
          ) : null}
          {note?.meta.Pair ? (
            <>
              <div className="meta-sep" />
              <div className="meta-item">{note.meta.Pair}</div>
            </>
          ) : null}
          {note?.meta.PnL ? (
            <>
              <div className="meta-sep" />
              <div
                className="meta-item"
                style={{
                  color: note.meta.PnL.startsWith("+")
                    ? "var(--green)"
                    : note.meta.PnL.startsWith("-")
                      ? "var(--red)"
                      : "var(--text3)",
                }}
              >
                {note.meta.Status === "open" ? `Open · ${note.meta.PnL}` : note.meta.PnL}
              </div>
            </>
          ) : null}
          {!note ? <div className="meta-item">Just now</div> : null}
        </div>

        <div className={`note-content${!note ? " draft" : ""}`}>
          {note ? (
            <>
              {noteContent}
              {codeBlock ? (
                <CodeBlock
                  language="typescript"
                  code={codeBlock}
                  copied={copiedCode}
                  onCopy={onCopyCode}
                />
              ) : null}
            </>
          ) : (
            <textarea
              ref={draftTextareaRef}
              value={draftBody}
              onChange={(event) => onDraftBodyChange(event.target.value)}
              className="draft-textarea resize-none border-none bg-transparent px-0 py-0 text-[15px] leading-[1.85] text-[var(--text2)] outline-none placeholder:text-[var(--text3)]"
              placeholder="Start writing..."
            />
          )}

          {!note
            ? draftBlocks.map((block) =>
                block.type === "code" ? (
                  <CodeInsertBlock
                    key={block.id}
                    code={block.code}
                    onChange={(nextCode) => onCodeBlockChange(block.id, nextCode)}
                    onRemove={() => onRemoveBlock(block.id)}
                  />
                ) : (
                  <TradeInsertBlock
                    key={block.id}
                    trade={block.trade}
                    onChange={(nextTrade) => onTradeBlockChange(block.id, nextTrade)}
                    onRemove={() => onRemoveBlock(block.id)}
                  />
                ),
              )
            : null}
        </div>
      </div>
      {agentOpen ? (
        <AgentPopupBar
          value={aiValue}
          onChange={onAiChange}
          onAsk={onAskAi}
          onShortcut={onAiShortcut}
          onClose={onToggleAgent}
        />
      ) : null}
    </div>
  );
}
