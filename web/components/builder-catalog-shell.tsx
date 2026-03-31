"use client";

import { useEffect, useState } from "react";

import type { BuiltInBackgroundRecord } from "@/lib/builtins/backgrounds";
import type { BuiltInClassRecord } from "@/lib/builtins/classes";
import type { BuiltInRaceRecord } from "@/lib/builtins/races";
import { BuilderEditor } from "@/components/builder-editor";
import { resolveBuilderCatalogs } from "@/lib/content-sources/catalog-resolver";
import type { CharacterDraft } from "@/lib/characters/types";

type BuilderCatalogShellProps = {
  initialBackgrounds: BuiltInBackgroundRecord[];
  initialClasses: BuiltInClassRecord[];
  initialDraft?: CharacterDraft;
  initialRaces: BuiltInRaceRecord[];
};

export function BuilderCatalogShell({
  initialBackgrounds,
  initialClasses,
  initialDraft,
  initialRaces,
}: BuilderCatalogShellProps) {
  const [catalogs, setCatalogs] = useState({
    backgrounds: initialBackgrounds,
    classes: initialClasses,
    races: initialRaces,
  });

  useEffect(() => {
    let cancelled = false;

    async function hydrateCatalogs() {
      try {
        const resolved = await resolveBuilderCatalogs();

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
  }, []);

  return (
    <BuilderEditor
      backgrounds={catalogs.backgrounds}
      classes={catalogs.classes}
      initialDraft={initialDraft}
      races={catalogs.races}
    />
  );
}
