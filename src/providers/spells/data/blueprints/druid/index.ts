import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellHealRuneCreation } from "./SpellHealRuneCreation";

export const druidSpellsIndex = {
  [SpellsBlueprint.HealRuneCreationSpell]: spellHealRuneCreation,
};
