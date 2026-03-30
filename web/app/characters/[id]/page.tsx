import { RouteShell } from "@/components/route-shell";

type CharacterDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const { id } = await params;

  return (
    <RouteShell
      route={`/characters/${id}`}
      title="Character sheet placeholder"
      description="This dynamic route stands in for the future character sheet experience. It currently confirms route parameters and keeps the path stable for later data hydration."
      bullets={[
        `Captured character id: ${id}`,
        "Reserved for read-only sheet and summary rendering.",
        "No fetch or mutation behavior is attached yet.",
      ]}
    />
  );
}
