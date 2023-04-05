import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { rogueSpellExecution } from "./SpellExecution";
import { spellStealth } from "./SpellStealth";

export const rogueSpellsIndex = {
  [SpellsBlueprint.RogueStealth]: spellStealth,
  [SpellsBlueprint.RogueExecution]: rogueSpellExecution,
};
