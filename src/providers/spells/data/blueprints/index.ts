import { SpellsBlueprint } from "../types/SpellsBlueprintTypes";
import { spellFoodCreation } from "./SpellFoodCreation";
import { spellSelfHealing } from "./SpellSelfHealing";

export const spellsBlueprints = {
  [SpellsBlueprint.SelfHealingSpell]: spellSelfHealing,
  [SpellsBlueprint.FoodCreationSpell]: spellFoodCreation,
};
