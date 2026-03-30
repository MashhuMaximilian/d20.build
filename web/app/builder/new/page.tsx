import { BuilderEditor } from "@/components/builder-editor";
import { getBuiltInSrdBackgrounds } from "@/lib/builtins/backgrounds";
import { getBuiltInSrdClasses } from "@/lib/builtins/classes";
import { getBuiltInSrdRaces } from "@/lib/builtins/races";

export default function BuilderNewPage() {
  const backgrounds = getBuiltInSrdBackgrounds();
  const races = getBuiltInSrdRaces();
  const classes = getBuiltInSrdClasses();

  return <BuilderEditor backgrounds={backgrounds} classes={classes} races={races} />;
}
