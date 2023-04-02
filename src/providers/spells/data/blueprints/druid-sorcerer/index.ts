import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellEnergyBoltRuneCreation } from "./SpellEnergyBoltRuneCreation";
import { spellFireBoltRuneCreation } from "./SpellFireBoltRuneCreation";
import { spellMagicShield } from "./SpellMagicShield";
import { spellThunderRuneCreation } from "./SpellThunderRuneCreation";

export const druidSorcererSpellsIndex = {
  [SpellsBlueprint.EnergyBoltRuneCreationSpell]: spellEnergyBoltRuneCreation,
  [SpellsBlueprint.FireBoltRuneCreationSpell]: spellFireBoltRuneCreation,
  [SpellsBlueprint.SpellMagicShield]: spellMagicShield,
  [SpellsBlueprint.ThunderRuneCreationSpell]: spellThunderRuneCreation,
};
