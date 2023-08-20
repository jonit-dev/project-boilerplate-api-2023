import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellEntanglingRoots } from "./SpellEntanglingRoots";
import { spellHealRuneCreation } from "./SpellHealRuneCreation";
import { spellMassHealing } from "./SpellMassHealing";
import { spellShapeshift } from "./SpellShapeshift";
import { spellSilence } from "./SpellSilence";
import { spellVineGrasp } from "./SpellVineGrasp";

export const druidSpellsIndex = {
  [SpellsBlueprint.HealRuneCreationSpell]: spellHealRuneCreation,
  [SpellsBlueprint.DruidShapeshift]: spellShapeshift,
  [SpellsBlueprint.DruidSilence]: spellSilence,
  [SpellsBlueprint.EntanglingRoots]: spellEntanglingRoots,
  [SpellsBlueprint.VineGrasp]: spellVineGrasp,
  [SpellsBlueprint.MassHealing]: spellMassHealing,
};
