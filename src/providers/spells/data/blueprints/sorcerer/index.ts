import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellCorruptionBolt } from "./SpellCorruptionBolt";
import { spellCorruptionRuneCreation } from "./SpellCorruptionRuneCreation";
import { spellCurseOfWeakness } from "./SpellCurseOfWeakness";
import { spellDarkRuneCreation } from "./SpellDarkRuneCreation";
import { spellPolymorph } from "./SpellPolymorph";
import { spellVeilofUndeath } from "./SpellVeilofUndeath";

export const sorcererSpellsIndex = {
  [SpellsBlueprint.CorruptionRuneCreationSpell]: spellCorruptionRuneCreation,
  [SpellsBlueprint.DarkRuneCreationSpell]: spellDarkRuneCreation,
  [SpellsBlueprint.CurseOfWeakness]: spellCurseOfWeakness,
  [SpellsBlueprint.SpellPolymorph]: spellPolymorph,
  [SpellsBlueprint.CorruptionBolt]: spellCorruptionBolt,
  [SpellsBlueprint.SorcererVeilofUndeath]: spellVeilofUndeath,
};
