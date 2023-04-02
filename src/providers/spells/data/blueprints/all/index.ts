import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellArrowCreation } from "./SpellArrowCreation";
import { spellBlankRuneCreation } from "./SpellBlankRuneCreation";
import { spellFireRuneCreation } from "./SpellFireRuneCreation";
import { spellFoodCreation } from "./SpellFoodCreation";
import { spellGreaterHealing } from "./SpellGreaterHealing";
import { spellPoisonRuneCreation } from "./SpellPoisonRuneCreation";
import { spellSelfHaste } from "./SpellSelfHaste";
import { spellSelfHealing } from "./SpellSelfHealing";

export const allClassesSpellsIndex = {
  [SpellsBlueprint.SelfHealingSpell]: spellSelfHealing,
  [SpellsBlueprint.ArrowCreationSpell]: spellArrowCreation,
  [SpellsBlueprint.BlankRuneCreationSpell]: spellBlankRuneCreation,
  [SpellsBlueprint.FireRuneCreationSpell]: spellFireRuneCreation,
  [SpellsBlueprint.FoodCreationSpell]: spellFoodCreation,
  [SpellsBlueprint.GreaterHealingSpell]: spellGreaterHealing,
  [SpellsBlueprint.PoisonRuneCreationSpell]: spellPoisonRuneCreation,
  [SpellsBlueprint.SelfHasteSpell]: spellSelfHaste,
};
