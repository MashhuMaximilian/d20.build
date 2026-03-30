import { CharacterSheet } from "@/components/character-sheet";

type CharacterDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const { id } = await params;

  return <CharacterSheet draftId={id} />;
}
