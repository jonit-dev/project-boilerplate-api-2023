import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellFortifyDefense } from "./SpellFortifyDefense";
import { spellPhysicalShield } from "./SpellPhysicalShield";
import { spellPowerStrike } from "./SpellPowerStrike";
import { spellStunTarget } from "./SpellStunTarget";

export const warriorSpellsIndex = {
  [SpellsBlueprint.SpellPhysicalShield]: spellPhysicalShield,
  [SpellsBlueprint.WarriorStunTarget]: spellStunTarget,
  [SpellsBlueprint.FortifyDefense]: spellFortifyDefense,
  [SpellsBlueprint.PowerStrike]: spellPowerStrike,
};
