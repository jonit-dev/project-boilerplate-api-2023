import { SpellsBlueprint } from "../types/SpellsBlueprintTypes";

import { spellArrowCreation } from "./all/SpellArrowCreation";
import { spellBlankRuneCreation } from "./all/SpellBlankRuneCreation";
import { spellFireRuneCreation } from "./all/SpellFireRuneCreation";
import { spellFoodCreation } from "./all/SpellFoodCreation";
import { spellGreaterHealing } from "./all/SpellGreaterHealing";
import { spellPoisonRuneCreation } from "./all/SpellPoisonRuneCreation";
import { spellSelfHaste } from "./all/SpellSelfHaste";
import { spellSelfHealing } from "./all/SpellSelfHealing";
import { spellBloodthirst } from "./berserker/SpellBloodthirst";
import { spellEnergyBoltCreation } from "./druid-sorcerer/SpellEnergyBoltCreation";
import { spellFireBoltCreation } from "./druid-sorcerer/SpellFireBoltCreation";
import { spellMagicShield } from "./druid-sorcerer/SpellMagicShield";
import { spellThunderRuneCreation } from "./druid-sorcerer/SpellThunderRuneCreation";
import { spellHealRuneCreation } from "./druid/SpellHealRuneCreation";
import { spellBoltCreation } from "./hunter/SpellBoltCreation";
import { spellEagleEyes } from "./hunter/SpellEagleEyes";
import { spellExecution } from "./rogue/SpellExecution";
import { spellCorruptionRuneCreation } from "./sorcerer/SpellCorruptionRuneCreation";
import { spellDarkRuneCreation } from "./sorcerer/SpellDarkRuneCreation";
import { spellPhysicalShield } from "./warrior/SpellPhysicalShield";
import { spellStunTarget } from "./warrior/SpellStunTarget";

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
  [SpellsBlueprint.WarriorStunTarget]: spellStunTarget,
  [SpellsBlueprint.BerserkerBloodthirst]: spellBloodthirst,
  [SpellsBlueprint.RogueExecution]: spellExecution,
};
