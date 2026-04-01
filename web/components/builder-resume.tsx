"use client";

import { useEffect, useState } from "react";

import { BuilderCatalogShell } from "@/components/builder-catalog-shell";
import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import type { BuiltInElement } from "@/lib/builtins/types";
import { getRemoteCharacterDraft } from "@/lib/characters/repository";
import { getCharacterDraft } from "@/lib/characters/storage";
import type { CharacterDraft } from "@/lib/characters/types";

type BuilderResumeProps = {
  backgrounds: BuiltInBackgroundRecord[];
  classes: BuiltInClassRecord[];
  draftId: string;
  feats: BuiltInElement[];
  races: BuiltInRaceRecord[];
  spells: BuiltInElement[];
};

export function BuilderResume({
  backgrounds,
  classes,
  draftId,
  feats,
  races,
  spells,
}: BuilderResumeProps) {
  const [draft, setDraft] = useState<CharacterDraft | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function loadDraft() {
      const localDraft = getCharacterDraft(draftId);

      if (localDraft) {
        if (!cancelled) {
          setDraft(localDraft);
        }
        return;
      }

      const remoteDraft = await getRemoteCharacterDraft(draftId);

      if (!cancelled) {
        setDraft(remoteDraft);
      }
    }

    void loadDraft();

    return () => {
      cancelled = true;
    };
  }, [draftId]);

  if (draft === undefined) {
    return null;
  }

  if (draft === null) {
    return (
      <section className="builder-panel">
        <span className="builder-panel__label">Draft not found</span>
        <p className="route-shell__copy">
          This builder draft only exists in the browser where it was created.
        </p>
      </section>
    );
  }

  return (
    <BuilderCatalogShell
      initialBackgrounds={backgrounds}
      initialClasses={classes}
      initialDraft={draft}
      initialFeats={feats}
      initialRaces={races}
      initialSpells={spells}
    />
  );
}
