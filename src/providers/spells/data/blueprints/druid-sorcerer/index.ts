import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellDivineProtection } from "./SpellDivineProtection";
import { spellEnergyBoltRuneCreation } from "./SpellEnergyBoltRuneCreation";
import { spellFireBoltRuneCreation } from "./SpellFireBoltRuneCreation";
import { spellThunderRuneCreation } from "./SpellThunderRuneCreation";

export const druidSorcererSpellsIndex = {
  [SpellsBlueprint.EnergyBoltRuneCreationSpell]: spellEnergyBoltRuneCreation,
  [SpellsBlueprint.FireBoltRuneCreationSpell]: spellFireBoltRuneCreation,
  [SpellsBlueprint.SpellDivineProtection]: spellDivineProtection,
  [SpellsBlueprint.ThunderRuneCreationSpell]: spellThunderRuneCreation,
};
