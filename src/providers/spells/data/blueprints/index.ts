import { SpellsBlueprint } from "../types/SpellsBlueprintTypes";
import { spellArrowCreation } from "./SpellArrowCreation";
import { spellBlankRuneCreation } from "./SpellBlankRuneCreation";
import { spellBoltCreation } from "./SpellBoltCreation";
import { spellFoodCreation } from "./SpellFoodCreation";
import { spellSelfHealing } from "./SpellSelfHealing";

export const spellsBlueprints = {
  [SpellsBlueprint.SelfHealingSpell]: spellSelfHealing,
  [SpellsBlueprint.FoodCreationSpell]: spellFoodCreation,
  [SpellsBlueprint.ArrowCreationSpell]: spellArrowCreation,
  [SpellsBlueprint.BoltCreationSpell]: spellBoltCreation,
  [SpellsBlueprint.BlankRuneCreationSpell]: spellBlankRuneCreation,
};
