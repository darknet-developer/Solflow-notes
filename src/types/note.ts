export type NoteId = string;

export type NoteView = "home" | "all" | "journal" | "dev" | "decisions" | "research";

export type NoteFilter = "all" | "open" | "closed" | "notarized";

export type NoteTagTone = "accent" | "green" | "red" | "dim";

export type NoteTag = {
  label: string;
  tone: NoteTagTone;
};

export type NoteRelation = {
  title: string;
  match: string;
};

export type NoteMeta = Partial<{
  Pair: string;
  Entry: string;
  PnL: string;
  Status: string;
  Words: string;
  Created: string;
  Modified: string;
  Folder: string;
}>;

export type NoteRecord = {
  id: NoteId;
  view: Exclude<NoteView, "all">;
  filters: NoteFilter[];
  title: string;
  date: string;
  preview: string;
  tags: NoteTag[];
  proof: boolean;
  notarized: boolean;
  hash?: string;
  slot?: string;
  slotDate?: string;
  meta: NoteMeta;
  related: NoteRelation[];
  contentKey: string;
};
