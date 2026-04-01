import { BuilderCatalogShell } from "@/components/builder-catalog-shell";
import { getBuiltInSrdBackgrounds } from "@/lib/builtins/backgrounds";
import { getBuiltInSrdClasses } from "@/lib/builtins/classes";
import { getBuiltInSrdFeats } from "@/lib/builtins/feats";
import { getBuiltInSrdRaces } from "@/lib/builtins/races";
import { getBuiltInSrdSpells } from "@/lib/builtins/spells";

export default function BuilderNewPage() {
  const backgrounds = getBuiltInSrdBackgrounds();
  const races = getBuiltInSrdRaces();
  const classes = getBuiltInSrdClasses();
  const feats = getBuiltInSrdFeats();
  const spells = getBuiltInSrdSpells();

  return (
    <BuilderCatalogShell
      initialBackgrounds={backgrounds}
      initialClasses={classes}
      initialFeats={feats}
      initialRaces={races}
      initialSpells={spells}
    />
  );
}
