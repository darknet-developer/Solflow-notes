"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TradeTemplateCard } from "@/components/app/trade-template-card";

type NotepadNote = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  codeSnippet: string;
  showCode: boolean;
  showTrade: boolean;
  tradeTemplate: {
    pair: string;
    entry: string;
    current: string;
    invalidation: string;
    conviction: string;
    thesis: string;
  };
};

type SaveState = "idle" | "saving" | "saved";

type NotepadWorkspaceProps = {
  initialNoteId?: string;
};

const STORAGE_KEY = "secondbrain.notepad.v1";

const DEFAULT_NOTES: NotepadNote[] = [
  {
    id: "welcome-note",
    title: "Welcome to Notepad",
    body:
      "This is your working note space.\n\nStart with a quick brain dump, then split ideas into focused notes.\n\nNext step: define your first tool flow and expected output.",
    createdAt: "2026-04-07T00:00:00.000Z",
    updatedAt: "2026-04-07T00:00:00.000Z",
    codeSnippet:
      "// Position size - 15% book at $142\nconst calcPos = (book: number, pct: number, entry: number) => ({\n  usdc: book * (pct / 100),\n  tokens: (book * pct / 100) / entry,\n  risk: (book * pct / 100) * 0.049,\n});",
    showCode: false,
    showTrade: false,
    tradeTemplate: {
      pair: "SOL / USDC",
      entry: "$142.00",
      current: "$159.60",
      invalidation: "$135.00",
      conviction: "8 / 10",
      thesis:
        "Firedancer upgrade narrative is underpriced. Entry above key breakout with clear invalidation and defined risk.",
    },
  },
];

function formatSavedTime(iso: string | null): string {
  if (!iso) return "Not saved yet";
  const date = new Date(iso);
  return `Saved ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

function buildNoteId(title: string): string {
  const base = slugFromTitle(title) || "note";
  const stamp = Date.now().toString(36);
  return `${base}-${stamp}`;
}

function sortByUpdatedDesc(notes: NotepadNote[]): NotepadNote[] {
  return [...notes].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

function readStoredNotes(): NotepadNote[] {
  if (typeof window === "undefined") {
    return DEFAULT_NOTES;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return DEFAULT_NOTES;
  }

  try {
    const parsed = JSON.parse(raw) as NotepadNote[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_NOTES;
    }
    const normalized = parsed.map((note) => ({
      ...note,
      codeSnippet: note.codeSnippet ?? "",
      showCode: note.showCode ?? false,
      showTrade: note.showTrade ?? false,
      tradeTemplate: note.tradeTemplate ?? {
        pair: "SOL / USDC",
        entry: "$142.00",
        current: "$159.60",
        invalidation: "$135.00",
        conviction: "8 / 10",
        thesis: "",
      },
    }));
    return sortByUpdatedDesc(normalized);
  } catch {
    return DEFAULT_NOTES;
  }
}

function ensureSelectedNote(notes: NotepadNote[], preferredId?: string): string {
  if (preferredId && notes.some((note) => note.id === preferredId)) {
    return preferredId;
  }
  return notes[0]?.id ?? "";
}

export function NotepadWorkspace({ initialNoteId }: NotepadWorkspaceProps) {
  const router = useRouter();
  const saveIdleTimeoutRef = useRef<number | null>(null);

  const [notes, setNotes] = useState<NotepadNote[]>(() => {
    const seeded = readStoredNotes();
    if (initialNoteId && !seeded.some((note) => note.id === initialNoteId)) {
      const now = new Date().toISOString();
      return [
        {
          id: initialNoteId,
          title: "Untitled note",
          body: "",
          createdAt: now,
          updatedAt: now,
          codeSnippet: "",
          showCode: false,
          showTrade: false,
          tradeTemplate: {
            pair: "SOL / USDC",
            entry: "$142.00",
            current: "$159.60",
            invalidation: "$135.00",
            conviction: "8 / 10",
            thesis: "",
          },
        },
        ...seeded,
      ];
    }
    return seeded;
  });

  const [selectedId, setSelectedId] = useState<string>(() => ensureSelectedNote(notes, initialNoteId));
  const [search, setSearch] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter((note) => {
      return note.title.toLowerCase().includes(query) || note.body.toLowerCase().includes(query);
    });
  }, [notes, search]);

  const activeNote = useMemo(() => {
    return notes.find((note) => note.id === selectedId) ?? notes[0] ?? null;
  }, [notes, selectedId]);

  const persist = (nextNotes: NotepadNote[]) => {
    const next = sortByUpdatedDesc(nextNotes);
    const nextSelectedId = ensureSelectedNote(next, selectedId);

    setNotes(next);
    setSelectedId(nextSelectedId);
    setSaveState("saving");

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }

    const now = new Date().toISOString();
    setLastSavedAt(now);
    setSaveState("saved");

    if (saveIdleTimeoutRef.current !== null) {
      window.clearTimeout(saveIdleTimeoutRef.current);
    }
    saveIdleTimeoutRef.current = window.setTimeout(() => {
      setSaveState("idle");
    }, 1200);
  };

  const selectNote = (id: string) => {
    setSelectedId(id);
    router.replace(`/notes/${id}`);
  };

  const createNote = () => {
    const now = new Date().toISOString();
    const id = buildNoteId("untitled-note");
    const draft: NotepadNote = {
      id,
      title: "Untitled note",
      body: "",
      createdAt: now,
      updatedAt: now,
      codeSnippet: "",
      showCode: false,
      showTrade: false,
      tradeTemplate: {
        pair: "SOL / USDC",
        entry: "$142.00",
        current: "$159.60",
        invalidation: "$135.00",
        conviction: "8 / 10",
        thesis: "",
      },
    };
    persist([draft, ...notes]);
    setSelectedId(id);
    router.replace(`/notes/${id}`);
  };

  const updateActiveNote = (patch: Pick<NotepadNote, "title" | "body">) => {
    if (!activeNote) return;
    const now = new Date().toISOString();
    const nextNotes = notes.map((note) => {
      if (note.id !== activeNote.id) return note;
      return { ...note, ...patch, updatedAt: now };
    });
    persist(nextNotes);
  };

  const patchActiveNote = (patch: Partial<NotepadNote>) => {
    if (!activeNote) return;
    const now = new Date().toISOString();
    const nextNotes = notes.map((note) => {
      if (note.id !== activeNote.id) return note;
      return { ...note, ...patch, updatedAt: now };
    });
    persist(nextNotes);
  };

  const deleteActiveNote = () => {
    if (!activeNote) return;
    if (notes.length === 1) {
      const now = new Date().toISOString();
      const fallback: NotepadNote = {
        id: "untitled-note",
        title: "Untitled note",
        body: "",
        createdAt: now,
        updatedAt: now,
        codeSnippet: "",
        showCode: false,
        showTrade: false,
        tradeTemplate: {
          pair: "SOL / USDC",
          entry: "$142.00",
          current: "$159.60",
          invalidation: "$135.00",
          conviction: "8 / 10",
          thesis: "",
        },
      };
      persist([fallback]);
      router.replace(`/notes/${fallback.id}`);
      return;
    }

    const remaining = notes.filter((note) => note.id !== activeNote.id);
    const nextSelected = ensureSelectedNote(remaining);
    persist(remaining);
    router.replace(`/notes/${nextSelected}`);
  };

  return (
    <section className="flex h-[100dvh] min-h-0 overflow-hidden border border-white/10 bg-[#0b0d17] text-[#e8eaf7]">
      <aside className="flex h-full w-[320px] min-w-[320px] flex-col border-r border-white/10 bg-[#0c1120]">
        <div className="border-b border-white/10 p-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#7f89a8]">Notepad</p>
          <button
            type="button"
            onClick={createNote}
            className="mt-3 w-full rounded-md border border-[#1e315f] bg-[#111a33] px-3 py-2 text-left text-sm text-[#ced9ff] transition hover:border-[#2d4a8f] hover:bg-[#132043]"
          >
            + New note
          </button>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search title or content"
            className="mt-3 w-full rounded-md border border-white/10 bg-[#0a0f1d] px-3 py-2 text-sm text-[#c9d3f3] outline-none transition placeholder:text-[#6d7594] focus:border-[#3659ad]"
          />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {filteredNotes.map((note) => {
            const active = note.id === activeNote?.id;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => selectNote(note.id)}
                className={`block w-full border-b border-white/5 px-4 py-3 text-left transition ${
                  active ? "bg-[#152241]" : "hover:bg-[#101833]"
                }`}
              >
                <p className="truncate text-sm text-[#edf1ff]">{note.title || "Untitled note"}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#8a95ba]">
                  {note.body || "No content yet."}
                </p>
              </button>
            );
          })}
          {filteredNotes.length === 0 ? (
            <p className="p-4 text-sm text-[#8a95ba]">No notes match this search.</p>
          ) : null}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div>
            <p className="text-xs text-[#8a95ba]">{saveState === "saving" ? "Saving..." : formatSavedTime(lastSavedAt)}</p>
          </div>
          <button
            type="button"
            onClick={deleteActiveNote}
            className="rounded-md border border-[#5a2434] bg-[#2a1119] px-3 py-1.5 text-xs font-medium text-[#f6c9d4] transition hover:border-[#884057] hover:bg-[#361621]"
          >
            Delete note
          </button>
        </div>

        {activeNote ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5">
            <input
              value={activeNote.title}
              onChange={(event) => updateActiveNote({ title: event.target.value, body: activeNote.body })}
              placeholder="Note title"
              className="w-full border-0 bg-transparent font-serif text-4xl tracking-[-0.03em] text-[#f2f5ff] outline-none placeholder:text-[#5f6a8d]"
            />

            <div className="mt-4 flex flex-wrap items-center gap-1 border-y border-white/10 py-2">
              {["B", "I", "U", "H1", "H2", "LIST", "CODE", "PDF", "IMG", "TRADE"].map((item) => {
                const active = (item === "CODE" && activeNote.showCode) || (item === "TRADE" && activeNote.showTrade);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      if (item === "CODE") {
                        patchActiveNote({ showCode: !activeNote.showCode });
                      } else if (item === "TRADE") {
                        patchActiveNote({ showTrade: !activeNote.showTrade });
                      }
                    }}
                    className={`rounded-md px-3 py-1.5 text-sm transition ${
                      active ? "bg-[#1f2f5a] text-[#dbe6ff]" : "text-[#8a95ba] hover:bg-[#101833] hover:text-[#c9d3f3]"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            {activeNote.showCode ? (
              <div className="mt-5 rounded-xl border border-white/15 bg-[#0c1326] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6f7ca3]">Typescript</p>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(activeNote.codeSnippet)}
                    className="rounded px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[#9eb3f1] hover:bg-[#162347]"
                  >
                    Copy
                  </button>
                </div>
                <textarea
                  value={activeNote.codeSnippet}
                  onChange={(event) => patchActiveNote({ codeSnippet: event.target.value })}
                  className="h-44 w-full resize-none border-0 bg-transparent p-2 font-mono text-sm leading-7 text-[#cfdcff] outline-none"
                  placeholder="// write code here"
                />
              </div>
            ) : null}

            {activeNote.showTrade ? (
              <TradeTemplateCard
                value={activeNote.tradeTemplate}
                onChange={(tradeTemplate) => patchActiveNote({ tradeTemplate })}
              />
            ) : null}

            <textarea
              value={activeNote.body}
              onChange={(event) => updateActiveNote({ title: activeNote.title, body: event.target.value })}
              placeholder="Write your note..."
              className="mt-5 min-h-0 flex-1 w-full resize-none rounded-xl border border-white/10 bg-[#0a1020] p-4 text-sm leading-7 text-[#d4dcfa] outline-none transition placeholder:text-[#6d7594] focus:border-[#3659ad]"
            />
          </div>
        ) : (
          <div className="grid flex-1 place-items-center text-sm text-[#8a95ba]">Create your first note.</div>
        )}
      </div>
    </section>
  );
}
