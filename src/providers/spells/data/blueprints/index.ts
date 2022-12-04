import { SpellsBlueprint } from "../types/SpellsBlueprintTypes";
import { spellSelfHealing } from "./SpellSelfHealing";

export const spellsBlueprints = {
  [SpellsBlueprint.SelfHealingSpell]: spellSelfHealing,
};
