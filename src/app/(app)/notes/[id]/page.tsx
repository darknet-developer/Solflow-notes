import { NotepadWorkspace } from "@/components/app/notepad-workspace";

type NotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { id } = await params;

  return <NotepadWorkspace initialNoteId={id} />;
}
