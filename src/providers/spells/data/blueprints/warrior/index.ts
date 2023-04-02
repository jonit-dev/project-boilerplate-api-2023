import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellPhysicalShield } from "./SpellPhysicalShield";
import { spellStunTarget } from "./SpellStunTarget";

export const warriorSpellsIndex = {
  [SpellsBlueprint.SpellPhysicalShield]: spellPhysicalShield,
  [SpellsBlueprint.WarriorStunTarget]: spellStunTarget,
};
