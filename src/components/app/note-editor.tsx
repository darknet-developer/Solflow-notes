import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { AgentPopupBar } from "@/components/app/agent-popup-bar";
import { EditorTopStrip } from "@/components/app/editor-top-strip";
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
  leftPanel?: ReactNode;
  rightPanel?: ReactNode;
  onTogglePanel: () => void;
  onToggleDetails: () => void;
  onToggleAgent: () => void;
  onTitleChange: (value: string) => void;
  onDraftBodyChange: (value: string) => void;
  onInsertCodeBlock: () => void;
  onInsertTradeBlock: () => void;
  onExportPdf: (payload: { title: string; html: string }) => void;
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

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
  leftPanel,
  rightPanel,
  onTogglePanel,
  onToggleDetails,
  onToggleAgent,
  onTitleChange,
  onDraftBodyChange,
  onInsertCodeBlock,
  onInsertTradeBlock,
  onExportPdf,
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
  const textTools: Array<[string, number]> = [
    ["B", 0],
    ["I", 1],
    ["U", 2],
    ["H1", 3],
    ["H2", 4],
    ["LIST", 5],
  ];
  const middleTools: Array<[string, number]> = [
    ["CODE", 6],
    ["TRADE", 9],
  ];
  const rightTools: Array<[string, number]> = [
    ["PDF", 7],
    ["IMG", 8],
  ];

  const draftEditorRef = useRef<HTMLDivElement | null>(null);
  const noteContentRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    list: false,
  });
  const noteContent = note ? NOTE_CONTENT[note.contentKey] : null;

  useLayoutEffect(() => {
    if (note) return;
    const editor = draftEditorRef.current;
    if (!editor) return;
    if (editor.innerHTML !== draftBody) {
      editor.innerHTML = draftBody;
    }
  }, [draftBody, note]);

  useEffect(() => {
    if (note) {
      setFormatState({ bold: false, italic: false, underline: false, h1: false, h2: false, list: false });
      return;
    }

    const syncState = () => {
      const editor = draftEditorRef.current;
      if (!editor) return;
      const selection = window.getSelection();
      const anchorNode = selection?.anchorNode ?? null;
      const inEditor = !!anchorNode && editor.contains(anchorNode);
      if (!inEditor) return;

      const formatBlock = (document.queryCommandValue("formatBlock") || "").toString().toLowerCase();
      setFormatState({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        h1: formatBlock === "h1",
        h2: formatBlock === "h2",
        list: document.queryCommandState("insertUnorderedList"),
      });
    };

    document.addEventListener("selectionchange", syncState);
    return () => document.removeEventListener("selectionchange", syncState);
  }, [note]);

  const applyEditorFormat = (item: string) => {
    if (note) {
      return;
    }

    const editor = draftEditorRef.current;
    if (!editor) {
      return;
    }
    editor.focus();

    if (item === "B") {
      document.execCommand("bold");
    } else if (item === "I") {
      document.execCommand("italic");
    } else if (item === "U") {
      document.execCommand("underline");
    } else if (item === "H1") {
      const isH1 = (document.queryCommandValue("formatBlock") || "").toString().toLowerCase() === "h1";
      document.execCommand("formatBlock", false, isH1 ? "div" : "h1");
    } else if (item === "H2") {
      const isH2 = (document.queryCommandValue("formatBlock") || "").toString().toLowerCase() === "h2";
      document.execCommand("formatBlock", false, isH2 ? "div" : "h2");
    } else if (item === "LIST") {
      document.execCommand("insertUnorderedList");
    } else {
      return;
    }

    onDraftBodyChange(editor.innerHTML);

    const formatBlock = (document.queryCommandValue("formatBlock") || "").toString().toLowerCase();
    setFormatState({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      h1: formatBlock === "h1",
      h2: formatBlock === "h2",
      list: document.queryCommandState("insertUnorderedList"),
    });
  };

  const insertImageAtCursor = (src: string) => {
    if (note) {
      return;
    }

    const editor = draftEditorRef.current;
    if (!editor) {
      return;
    }

    editor.focus();
    const image = document.createElement("img");
    image.src = src;
    image.alt = "Uploaded image";

    const wrapper = document.createElement("p");
    wrapper.appendChild(image);
    wrapper.appendChild(document.createElement("br"));

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editor.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(wrapper);
        range.setStartAfter(wrapper);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      } else {
        editor.appendChild(wrapper);
      }
    } else {
      editor.appendChild(wrapper);
    }

    onDraftBodyChange(editor.innerHTML);
  };

  const handleImageFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        insertImageAtCursor(result);
      }
    };
    reader.readAsDataURL(file);
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

  const renderToolbarButton = (item: string, index: number) => (
    <button
      key={item}
      type="button"
      className={`tb-btn${
        item === "B"
          ? formatState.bold
            ? " on"
            : ""
          : item === "I"
            ? formatState.italic
              ? " on"
              : ""
            : item === "U"
              ? formatState.underline
                ? " on"
                : ""
              : item === "H1"
                ? formatState.h1
                  ? " on"
                  : ""
                : item === "H2"
                  ? formatState.h2
                    ? " on"
                    : ""
                  : item === "LIST"
                    ? formatState.list
                      ? " on"
                      : ""
                    : toolbarActive.includes(index)
                      ? " on"
                      : ""
      }`}
      onClick={() => {
        if (item === "CODE") {
          onInsertCodeBlock();
          return;
        }
        if (item === "TRADE") {
          onInsertTradeBlock();
          return;
        }
        if (item === "PDF") {
          const html = note
            ? noteContentRef.current?.innerHTML ?? ""
            : (() => {
                const bodyHtml = draftEditorRef.current?.innerHTML ?? "";
                const blocksHtml = draftBlocks
                  .map((block) => {
                    if (block.type === "code") {
                      return `<section class="pdf-block pdf-code">
  <h3>Code</h3>
  <pre><code>${escapeHtml(block.code)}</code></pre>
</section>`;
                    }

                    const trade = block.trade;
                    return `<section class="pdf-block pdf-trade">
  <h3>${escapeHtml(trade.pair || "Trade")}</h3>
  <div class="pdf-trade-grid">
    <div><span>Entry</span><strong>${escapeHtml(trade.entry)}</strong></div>
    <div><span>Current</span><strong>${escapeHtml(trade.current)}</strong></div>
    <div><span>Invalidation</span><strong>${escapeHtml(trade.invalidation)}</strong></div>
    <div><span>Conviction</span><strong>${escapeHtml(trade.conviction)}</strong></div>
  </div>
  <p>${escapeHtml(trade.thesis)}</p>
</section>`;
                  })
                  .join("");
                return `${bodyHtml}${blocksHtml}`;
              })();
          onExportPdf({ title, html });
          return;
        }
        if (item === "IMG") {
          if (note) {
            return;
          }
          if (imageInputRef.current) {
            imageInputRef.current.value = "";
            imageInputRef.current.click();
          }
          return;
        }
        if (item === "B" || item === "I" || item === "U" || item === "H1" || item === "H2" || item === "LIST") {
          applyEditorFormat(item);
          return;
        }
        onToggleToolbar(index);
      }}
    >
      {item}
    </button>
  );

  return (
    <div className={`editor${!panelHidden ? " with-left" : ""}${!detailsHidden ? " with-details" : ""}${panelHidden && detailsHidden ? " full-canvas" : ""}`}>
      <EditorTopStrip
        viewLabel={note ? VIEW_LABELS[note.view] : "Trade journal"}
        title={title}
        panelHidden={panelHidden}
        detailsHidden={detailsHidden}
        notarized={Boolean(note?.notarized)}
        onTogglePanel={onTogglePanel}
        onToggleDetails={onToggleDetails}
        onShare={onShare}
        onToggleAgent={onToggleAgent}
        textTools={textTools.map(([item, index]) => renderToolbarButton(item, index))}
        blockTools={middleTools.map(([item, index]) => renderToolbarButton(item, index))}
        mediaTools={rightTools.map(([item, index]) => renderToolbarButton(item, index))}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />

      <div className="editor-workspace">
        {!panelHidden && leftPanel ? <div className="editor-left-panel">{leftPanel}</div> : null}
        <div className="editor-canvas">
          <div className="ed-body">
            <input
              className="note-title"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="Untitled"
            />
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

        <div ref={noteContentRef} className={`note-content${!note ? " draft" : ""}`}>
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
            <div
              ref={draftEditorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={(event) => onDraftBodyChange(event.currentTarget.innerHTML)}
              className="draft-textarea resize-none border-none bg-transparent px-0 py-0 text-[15px] leading-[1.85] text-[var(--text2)] outline-none placeholder:text-[var(--text3)]"
              data-placeholder="Start writing..."
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
        </div>
        {!detailsHidden && rightPanel ? <div className="editor-right-panel">{rightPanel}</div> : null}
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
