import { RouteShell } from "@/components/route-shell";

export default function CharactersPage() {
  return (
    <RouteShell
      route="/characters"
      title="Character list placeholder"
      description="This page reserves the future authenticated character index. For now it exists to freeze the route surface and keep subsequent persistence work scoped."
      bullets={[
        "Intended home for saved character browsing.",
        "Ready for later session gating and Supabase-backed queries.",
        "No storage calls are made in this scaffold slice.",
      ]}
    />
  );
}
