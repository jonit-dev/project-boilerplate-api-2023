import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellCorruptionRuneCreation } from "./SpellCorruptionRuneCreation";
import { spellCurseOfWeakness } from "./SpellCurseOfWeakness";
import { spellDarkRuneCreation } from "./SpellDarkRuneCreation";

export const sorcererSpellsIndex = {
  [SpellsBlueprint.CorruptionRuneCreationSpell]: spellCorruptionRuneCreation,
  [SpellsBlueprint.DarkRuneCreationSpell]: spellDarkRuneCreation,
  [SpellsBlueprint.CurseOfWeakness]: spellCurseOfWeakness,
};
