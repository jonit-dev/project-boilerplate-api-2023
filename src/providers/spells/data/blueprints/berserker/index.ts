import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellBloodthirst } from "./SpellBloodthirst";
import { berserkerSpellExecution } from "./SpellExecution";
import { spellFrenzy } from "./SpellFrenzy";

export const berserkerSpellsIndex = {
  [SpellsBlueprint.BerserkerBloodthirst]: spellBloodthirst,
  [SpellsBlueprint.BerserkerExecution]: berserkerSpellExecution,
  [SpellsBlueprint.BerserkerFrenzy]: spellFrenzy,
};
