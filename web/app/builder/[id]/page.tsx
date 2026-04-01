import { BuilderResume } from "@/components/builder-resume";
import { getBuiltInSrdBackgrounds } from "@/lib/builtins/backgrounds";
import { getBuiltInSrdClasses } from "@/lib/builtins/classes";
import { getBuiltInSrdFeats } from "@/lib/builtins/feats";
import { getBuiltInSrdRaces } from "@/lib/builtins/races";
import { getBuiltInSrdSpells } from "@/lib/builtins/spells";

type BuilderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BuilderDetailPage({
  params,
}: BuilderDetailPageProps) {
  const { id } = await params;
  const backgrounds = getBuiltInSrdBackgrounds();
  const races = getBuiltInSrdRaces();
  const classes = getBuiltInSrdClasses();
  const feats = getBuiltInSrdFeats();
  const spells = getBuiltInSrdSpells();

  return (
    <BuilderResume
      backgrounds={backgrounds}
      classes={classes}
      draftId={id}
      feats={feats}
      races={races}
      spells={spells}
    />
  );
}
