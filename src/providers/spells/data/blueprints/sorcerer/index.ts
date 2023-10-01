import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellCorruptionBolt } from "./SpellCorruptionBolt";
import { spellCorruptionRuneCreation } from "./SpellCorruptionRuneCreation";
import { spellCorruptionWave } from "./SpellCorruptionWave";
import { spellCurseOfWeakness } from "./SpellCurseOfWeakness";
import { spellDarkRuneCreation } from "./SpellDarkRuneCreation";
import { spellFireStorm } from "./SpellFireStorm";
import { spellPolymorph } from "./SpellPolymorph";
import { spellVeilofUndeath } from "./SpellVeilofUndeath";
import { spellArcaneExplosion } from "./SpellArcaneExplosion";

export const sorcererSpellsIndex = {
  [SpellsBlueprint.CorruptionRuneCreationSpell]: spellCorruptionRuneCreation,
  [SpellsBlueprint.DarkRuneCreationSpell]: spellDarkRuneCreation,
  [SpellsBlueprint.CurseOfWeakness]: spellCurseOfWeakness,
  [SpellsBlueprint.SpellPolymorph]: spellPolymorph,
  [SpellsBlueprint.CorruptionBolt]: spellCorruptionBolt,
  [SpellsBlueprint.SorcererVeilofUndeath]: spellVeilofUndeath,
  [SpellsBlueprint.FireStorm]: spellFireStorm,
  [SpellsBlueprint.CorruptionWave]: spellCorruptionWave,
  [SpellsBlueprint.ArcaneExplosion]: spellArcaneExplosion,
};
