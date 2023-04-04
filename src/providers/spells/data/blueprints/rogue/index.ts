import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { rogueSpellExecution } from "./SpellExecution";

export const rogueSpellsIndex = {
  [SpellsBlueprint.RogueExecution]: rogueSpellExecution,
};
