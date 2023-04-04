import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellCorruptionRuneCreation } from "./SpellCorruptionRuneCreation";
import { spellDarkRuneCreation } from "./SpellDarkRuneCreation";
import { spellManaShield } from "./SpellManaShield";

export const sorcererSpellsIndex = {
  [SpellsBlueprint.CorruptionRuneCreationSpell]: spellCorruptionRuneCreation,
  [SpellsBlueprint.DarkRuneCreationSpell]: spellDarkRuneCreation,
  [SpellsBlueprint.SorcererManaShield]: spellManaShield,
};
