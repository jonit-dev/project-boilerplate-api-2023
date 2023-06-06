import { SpellsBlueprint } from "@rpg-engine/shared";
import { rogueSpellExecution } from "./SpellExecution";
import { spellMagicShuriken } from "./SpellMagicShuriken";
import { spellPickPocket } from "./SpellPickPocket";
import { spellStealth } from "./SpellStealth";

export const rogueSpellsIndex = {
  [SpellsBlueprint.RogueStealth]: spellStealth,
  [SpellsBlueprint.RogueExecution]: rogueSpellExecution,
  [SpellsBlueprint.PickPocket]: spellPickPocket,
  [SpellsBlueprint.MagicShuriken]: spellMagicShuriken,
};
