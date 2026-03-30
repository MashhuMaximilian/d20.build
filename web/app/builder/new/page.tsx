import { RouteShell } from "@/components/route-shell";
import { getBuiltInSrdRaceSummary } from "@/lib/builtins/races";

export default function BuilderNewPage() {
  const builtInRaces = getBuiltInSrdRaceSummary();

  return (
    <RouteShell
      route="/builder/new"
      title="New builder entry placeholder"
      description="This route marks the entry point for creating a new character. The scaffold now proves a narrow built-in SRD content path with repo-checked race data while keeping full builder state and save flows deferred."
      bullets={[
        `Built-in SRD starter races currently load from app-owned data: ${builtInRaces.names.join(", ")}.`,
        `This bounded slice includes ${builtInRaces.raceCount} races, ${builtInRaces.subraceCount} subraces, and ${builtInRaces.traitCount} related traits.`,
        "Future work can extend the same path to classes, spells, and backgrounds without switching storage models.",
      ]}
    />
  );
}
