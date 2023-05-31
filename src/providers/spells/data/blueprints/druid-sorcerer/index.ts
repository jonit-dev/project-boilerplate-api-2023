import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellDivineProtection } from "./SpellDivineProtection";
import { spellEnergyBoltRuneCreation } from "./SpellEnergyBoltRuneCreation";
import { spellFireBoltRuneCreation } from "./SpellFireBoltRuneCreation";
import { spellManaShield } from "./SpellManaShield";
import { spellThunderRuneCreation } from "./SpellThunderRuneCreation";
import { spellManaDrain } from "./SpellManaDrain";

export const druidSorcererSpellsIndex = {
  [SpellsBlueprint.EnergyBoltRuneCreationSpell]: spellEnergyBoltRuneCreation,
  [SpellsBlueprint.FireBoltRuneCreationSpell]: spellFireBoltRuneCreation,
  [SpellsBlueprint.SpellDivineProtection]: spellDivineProtection,
  [SpellsBlueprint.ThunderRuneCreationSpell]: spellThunderRuneCreation,
  [SpellsBlueprint.ManaShield]: spellManaShield,
  [SpellsBlueprint.ManaDrain]: spellManaDrain,
};
