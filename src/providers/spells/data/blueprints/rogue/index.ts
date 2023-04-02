import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellExecution } from "./SpellExecution";

export const rogueSpellsIndex = {
  [SpellsBlueprint.RogueExecution]: spellExecution,
};
