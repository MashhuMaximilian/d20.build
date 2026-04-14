import { BUILT_IN_SRD_ITEM_ELEMENTS } from "@/lib/builtins/generated-srd-items";

export type BuiltInItemElement = {
  id: string;
  type: string;
  name: string;
  source: string;
  sourceUrl: string;
  description: string;
  descriptionHtml?: string;
  supports: readonly string[];
  category?: string;
  subtype?: string;
  rarity?: string;
  cost?: string;
  weight?: string;
  slot?: string;
  attunement?: string;
};

export function getBuiltInSrdItems(): BuiltInItemElement[] {
  return BUILT_IN_SRD_ITEM_ELEMENTS.map((item) => ({
    ...item,
    supports: [...item.supports],
  })) as BuiltInItemElement[];
}

export function getBuiltInSrdItemSummary() {
  return {
    itemCount: BUILT_IN_SRD_ITEM_ELEMENTS.length,
    names: BUILT_IN_SRD_ITEM_ELEMENTS.map((item) => item.name),
  };
}
