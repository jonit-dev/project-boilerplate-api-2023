import { SpellsBlueprint } from "../types/SpellsBlueprintTypes";
import { spellArrowCreation } from "./SpellArrowCreation";
import { spellBlankRuneCreation } from "./SpellBlankRuneCreation";
import { spellBoltCreation } from "./SpellBoltCreation";
import { spellCorruptionRuneCreation } from "./SpellCorruptionRuneCreation";
import { spellDarkRuneCreation } from "./SpellDarkRuneCreation";
import { spellEagleEyes } from "./SpellEagleEyes";
import { spellEnergyBoltCreation } from "./SpellEnergyBoltCreation";
import { spellFireBoltCreation } from "./SpellFireBoltCreation";
import { spellFireRuneCreation } from "./SpellFireRuneCreation";
import { spellFoodCreation } from "./SpellFoodCreation";
import { spellGreaterHealing } from "./SpellGreaterHealing";
import { spellHealRuneCreation } from "./SpellHealRuneCreation";
import { spellMagicShield } from "./SpellMagicShield";
import { spellPhysicalShield } from "./SpellPhysicalShield";
import { spellPoisonRuneCreation } from "./SpellPoisonRuneCreation";
import { spellSelfHaste } from "./SpellSelfHaste";
import { spellSelfHealing } from "./SpellSelfHealing";
import { spellThunderRuneCreation } from "./SpellThunderRuneCreation";

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
  [SpellsBlueprint.CorruptionRuneCreationSpell]: spellCorruptionRuneCreation,
  [SpellsBlueprint.SpellMagicShield]: spellMagicShield,
  [SpellsBlueprint.SpellPhysicalShield]: spellPhysicalShield,
  [SpellsBlueprint.SpellEagleEyes]: spellEagleEyes,
  [SpellsBlueprint.ThunderRuneCreationSpell]: spellThunderRuneCreation,
};
