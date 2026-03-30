import { RouteShell } from "@/components/route-shell";
import { getBuiltInSrdClassSummary } from "@/lib/builtins/classes";
import { getBuiltInSrdRaceSummary } from "@/lib/builtins/races";

export default function BuilderNewPage() {
  const builtInRaces = getBuiltInSrdRaceSummary();
  const builtInClasses = getBuiltInSrdClassSummary();

  return (
    <RouteShell
      route="/builder/new"
      title="New builder entry placeholder"
      description="This route marks the entry point for creating a new character. The scaffold now proves a narrow built-in SRD content path with repo-checked race and class data while keeping full builder state and save flows deferred."
      bullets={[
        `Built-in SRD starter races currently load from app-owned data: ${builtInRaces.names.join(", ")}.`,
        `This bounded slice includes ${builtInRaces.raceCount} races, ${builtInRaces.subraceCount} subraces, and ${builtInRaces.traitCount} related traits.`,
        `Built-in SRD starter classes currently load from the same built-ins model: ${builtInClasses.names.join(", ")}.`,
        `The class slice currently covers ${builtInClasses.classCount} classes, ${builtInClasses.featureCount} class features, and ${builtInClasses.spellcastingFeatureCount} spellcasting entry point.`,
        "Future work can extend this path to backgrounds, feats, and spell catalogs without switching storage models.",
      ]}
    />
  );
}
