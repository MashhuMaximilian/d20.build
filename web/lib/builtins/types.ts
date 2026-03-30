export type BuiltInElementType =
  | "Background"
  | "Background Feature"
  | "Background Variant"
  | "Class"
  | "Class Feature"
  | "Archetype"
  | "Archetype Feature"
  | "Race"
  | "Sub Race"
  | "Racial Trait"
  | "Race Variant";

export type BuiltInSelectChoice = {
  id: string;
  value: string;
};

export type BuiltInRule =
  | {
      kind: "grant";
      type: string;
      id: string;
      requirements?: string;
      level?: number;
      prepared?: boolean;
      equipped?: boolean;
      alt?: string;
    }
  | {
      kind: "select";
      type: string;
      name: string;
      supports?: string;
      choices?: BuiltInSelectChoice[];
      requirements?: string;
      number?: number;
      optional?: boolean;
      level?: number;
      prepared?: boolean;
      equipped?: boolean;
      alt?: string;
    }
  | {
      kind: "stat";
      name: string;
      value: string;
      bonus?: string;
      requirements?: string;
      level?: number;
      alt?: string;
    };

export type BuiltInSetter = {
  name: string;
  value: string;
  type?: string;
  modifier?: string;
  alt?: string;
};

export type BuiltInMulticlass = {
  requirements?: string;
  requirementsDescription?: string;
  rules?: BuiltInRule[];
  setters?: BuiltInSetter[];
};

export type BuiltInSpellcasting = {
  ability?: string;
  name?: string;
  rules?: BuiltInRule[];
  setters?: BuiltInSetter[];
};

export type BuiltInElement = {
  id: string;
  type: BuiltInElementType;
  name: string;
  source: string;
  source_url: string;
  supports: string[];
  description: string;
  rules: BuiltInRule[];
  setters: BuiltInSetter[];
  multiclass?: BuiltInMulticlass;
  spellcasting?: BuiltInSpellcasting;
};
