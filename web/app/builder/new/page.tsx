import { BuilderCatalogShell } from "@/components/builder-catalog-shell";
import { getBuiltInSrdBackgrounds } from "@/lib/builtins/backgrounds";
import { getBuiltInSrdClasses, getBuiltInSrdClassElements } from "@/lib/builtins/classes";
import { getBuiltInSrdFeats } from "@/lib/builtins/feats";
import { getBuiltInSrdRaces } from "@/lib/builtins/races";
import { getBuiltInSrdSpells } from "@/lib/builtins/spells";

export default function BuilderNewPage() {
  const backgrounds = getBuiltInSrdBackgrounds();
  const races = getBuiltInSrdRaces();
  const classes = getBuiltInSrdClasses();
  const progressionElements = getBuiltInSrdClassElements();
  const feats = getBuiltInSrdFeats();
  const spells = getBuiltInSrdSpells();

  return (
    <BuilderCatalogShell
      initialBackgrounds={backgrounds}
      initialClasses={classes}
      initialFeats={feats}
      initialProgressionElements={progressionElements}
      initialRaces={races}
      initialSpells={spells}
    />
  );
}
