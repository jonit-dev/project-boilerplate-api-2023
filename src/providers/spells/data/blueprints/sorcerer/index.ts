import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellCorruptionRuneCreation } from "./SpellCorruptionRuneCreation";
import { spellDarkRuneCreation } from "./SpellDarkRuneCreation";

export const sorcererSpellsIndex = {
  [SpellsBlueprint.CorruptionRuneCreationSpell]: spellCorruptionRuneCreation,
  [SpellsBlueprint.DarkRuneCreationSpell]: spellDarkRuneCreation,
};
