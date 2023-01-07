import { SpellsBlueprint } from "../types/SpellsBlueprintTypes";
import { spellArrowCreation } from "./SpellArrowCreation";
import { spellBlankRuneCreation } from "./SpellBlankRuneCreation";
import { spellBoltCreation } from "./SpellBoltCreation";
import { spellDarkRuneCreation } from "./SpellDarkRuneCreation";
import { spellEnergyBoltCreation } from "./SpellEnergyBoltCreation";
import { spellFireBoltCreation } from "./SpellFireBoltCreation";
import { spellFireRuneCreation } from "./SpellFireRuneCreation";
import { spellFoodCreation } from "./SpellFoodCreation";
import { spellGreaterHealing } from "./SpellGreaterHealing";
import { spellHealRuneCreation } from "./SpellHealRuneCreation";
import { spellPoisonRuneCreation } from "./SpellPoisonRuneCreation";
import { spellSelfHaste } from "./SpellSelfHaste";
import { spellSelfHealing } from "./SpellSelfHealing";

export const spellsBlueprints = {
  [SpellsBlueprint.SelfHealingSpell]: spellSelfHealing,
  [SpellsBlueprint.FoodCreationSpell]: spellFoodCreation,
  [SpellsBlueprint.ArrowCreationSpell]: spellArrowCreation,
  [SpellsBlueprint.BoltCreationSpell]: spellBoltCreation,
  [SpellsBlueprint.BlankRuneCreationSpell]: spellBlankRuneCreation,
  [SpellsBlueprint.SelfHasteSpell]: spellSelfHaste,
  [SpellsBlueprint.FireRuneCreationSpell]: spellFireRuneCreation,
  [SpellsBlueprint.HealRuneCreationSpell]: spellHealRuneCreation,
  [SpellsBlueprint.DarkRuneCreationSpell]: spellDarkRuneCreation,
  [SpellsBlueprint.PoisonRuneCreationSpell]: spellPoisonRuneCreation,
  [SpellsBlueprint.GreaterHealingSpell]: spellGreaterHealing,
  [SpellsBlueprint.FireBoltCreationSpell]: spellFireBoltCreation,
  [SpellsBlueprint.EnergyBoltCreationSpell]: spellEnergyBoltCreation,
};
