import { RouteShell } from "@/components/route-shell";

type BuilderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BuilderDetailPage({
  params,
}: BuilderDetailPageProps) {
  const { id } = await params;

  return (
    <RouteShell
      route={`/builder/${id}`}
      title="Builder session placeholder"
      description="This dynamic builder shell holds the resume/edit path for a draft or saved character. It intentionally stops at route structure and parameter capture."
      bullets={[
        `Captured builder id: ${id}`,
        "Reserved for later builder state loading and save behavior.",
        "No editor UI or business logic is included in this slice.",
      ]}
    />
  );
}
