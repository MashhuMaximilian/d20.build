import { BuilderCatalogShell } from "@/components/builder-catalog-shell";
import { getBuiltInSrdBackgrounds } from "@/lib/builtins/backgrounds";
import { getBuiltInSrdClasses } from "@/lib/builtins/classes";
import { getBuiltInSrdRaces } from "@/lib/builtins/races";

export default function BuilderNewPage() {
  const backgrounds = getBuiltInSrdBackgrounds();
  const races = getBuiltInSrdRaces();
  const classes = getBuiltInSrdClasses();

  return (
    <BuilderCatalogShell
      initialBackgrounds={backgrounds}
      initialClasses={classes}
      initialRaces={races}
    />
  );
}
