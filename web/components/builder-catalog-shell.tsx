"use client";

import { useEffect, useState } from "react";

import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInElement } from "@/lib/builtins/types";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import { BuilderEditor } from "@/components/builder-editor";
import { resolveBuilderCatalogs } from "@/lib/content-sources/catalog-resolver";
import type { CharacterDraft } from "@/lib/characters/types";

type BuilderCatalogShellProps = {
  initialBackgrounds: BuiltInBackgroundRecord[];
  initialClasses: BuiltInClassRecord[];
  initialDraft?: CharacterDraft;
  initialFeats: BuiltInElement[];
  initialProgressionElements?: readonly BuiltInElement[];
  initialRaces: BuiltInRaceRecord[];
  initialSpells: BuiltInElement[];
};

export function BuilderCatalogShell({
  initialBackgrounds,
  initialClasses,
  initialDraft,
  initialFeats,
  initialProgressionElements = [],
  initialRaces,
  initialSpells,
}: BuilderCatalogShellProps) {
  const [catalogs, setCatalogs] = useState({
    backgrounds: initialBackgrounds,
    classes: initialClasses,
    feats: initialFeats,
    progressionElements: [...initialProgressionElements],
    races: initialRaces,
    spells: initialSpells,
  });

  useEffect(() => {
    let cancelled = false;

    async function hydrateCatalogs() {
      try {
        const resolved = await resolveBuilderCatalogs(initialSpells);

        if (!cancelled) {
          setCatalogs(resolved);
        }
      } catch {
        // Keep built-in SRD catalogs if device cache resolution fails.
      }
    }

    void hydrateCatalogs();

    return () => {
      cancelled = true;
    };
  }, [initialSpells]);

  return (
    <BuilderEditor
      backgrounds={catalogs.backgrounds}
      classes={catalogs.classes}
      feats={catalogs.feats}
      initialDraft={initialDraft}
      progressionElements={catalogs.progressionElements}
      races={catalogs.races}
      spells={catalogs.spells}
    />
  );
}
