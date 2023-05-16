import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellBloodthirst } from "./SpellBloodthirst";
import { berserkerSpellExecution } from "./SpellExecution";
import { spellFrenzy } from "./SpellFrenzy";
import { spellRage } from "./SpellRage";

export const berserkerSpellsIndex = {
  [SpellsBlueprint.BerserkerBloodthirst]: spellBloodthirst,
  [SpellsBlueprint.BerserkerExecution]: berserkerSpellExecution,
  [SpellsBlueprint.BerserkerFrenzy]: spellFrenzy,
  [SpellsBlueprint.BerserkerRage]: spellRage,
};
