import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellEntanglingRoots } from "./SpellEntanglingRoots";
import { spellHealRuneCreation } from "./SpellHealRuneCreation";
import { spellShapeshift } from "./SpellShapeshift";

export const druidSpellsIndex = {
  [SpellsBlueprint.HealRuneCreationSpell]: spellHealRuneCreation,
  [SpellsBlueprint.DruidShapeshift]: spellShapeshift,
  [SpellsBlueprint.EntanglingRoots]: spellEntanglingRoots,
};
