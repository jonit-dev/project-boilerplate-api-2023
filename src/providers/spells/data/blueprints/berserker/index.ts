import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellBloodthirst } from "./SpellBloodthirst";
import { berserkerSpellExecution } from "./SpellExecution";

export const berserkerSpellsIndex = {
  [SpellsBlueprint.BerserkerBloodthirst]: spellBloodthirst,
  [SpellsBlueprint.BerserkerExecution]: berserkerSpellExecution,
};
