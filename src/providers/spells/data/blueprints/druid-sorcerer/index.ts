import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellDivineProtection } from "../druid/SpellDivineProtection";
import { spellFrostBolt } from "../sorcerer/SpellFrostBolt";
import { spellEnergyBoltRuneCreation } from "./SpellEnergyBoltRuneCreation";
import { spellFireBolt } from "./SpellFireBolt";
import { spellFireBoltRuneCreation } from "./SpellFireBoltRuneCreation";
import { spellManaDrain } from "./SpellManaDrain";
import { spellManaShield } from "./SpellManaShield";
import { spellThunderRuneCreation } from "./SpellThunderRuneCreation";
import { spellBlizzard } from "./SpellBlizzard";

export const druidSorcererSpellsIndex = {
  [SpellsBlueprint.EnergyBoltRuneCreationSpell]: spellEnergyBoltRuneCreation,
  [SpellsBlueprint.FireBoltRuneCreationSpell]: spellFireBoltRuneCreation,
  [SpellsBlueprint.SpellDivineProtection]: spellDivineProtection,
  [SpellsBlueprint.ThunderRuneCreationSpell]: spellThunderRuneCreation,
  [SpellsBlueprint.ManaShield]: spellManaShield,
  [SpellsBlueprint.ManaDrain]: spellManaDrain,
  [SpellsBlueprint.FireBolt]: spellFireBolt,
  [SpellsBlueprint.FrostBolt]: spellFrostBolt,
  [SpellsBlueprint.Blizzard]: spellBlizzard,
};
