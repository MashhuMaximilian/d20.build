import type { ProficiencyFact } from './facts';

export interface GroupedProficiencies {
  tools: ProficiencyFact[];
  skills: ProficiencyFact[];
  weapons: ProficiencyFact[];
  armor: ProficiencyFact[];
  languages: ProficiencyFact[];
  savingThrows: ProficiencyFact[];
  vehicles: ProficiencyFact[];
  other: ProficiencyFact[];
}

/** Groups proficiency facts by their kind */
export function groupProficiencies(facts: ProficiencyFact[]): GroupedProficiencies {
  return {
    tools: facts.filter((f) => f.kind === 'tool'),
    skills: facts.filter((f) => f.kind === 'skill'),
    weapons: facts.filter((f) => f.kind === 'weapon'),
    armor: facts.filter((f) => f.kind === 'armor'),
    languages: facts.filter((f) => f.kind === 'language'),
    savingThrows: facts.filter((f) => f.kind === 'savingThrow'),
    vehicles: facts.filter((f) => f.kind === 'vehicle'),
    other: facts.filter((f) => f.kind === 'other'),
  };
}