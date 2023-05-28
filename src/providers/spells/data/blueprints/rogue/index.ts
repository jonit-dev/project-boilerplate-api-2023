import { rogueSpellExecution } from "./SpellExecution";
import { spellStealth } from "./SpellStealth";
import { spellPickPocket } from "./SpellPickPocket";
import { SpellsBlueprint } from "@rpg-engine/shared";

export const rogueSpellsIndex = {
  [SpellsBlueprint.RogueStealth]: spellStealth,
  [SpellsBlueprint.RogueExecution]: rogueSpellExecution,
  [SpellsBlueprint.PickPocket]: spellPickPocket,
};
