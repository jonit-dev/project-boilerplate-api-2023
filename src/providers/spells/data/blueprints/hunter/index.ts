import { SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { spellBoltCreation } from "./SpellBoltCreation";
import { spellEagleEyes } from "./SpellEagleEyes";
import { spellFireBoltCreation } from "./SpellFireBoltCreation";
import { spellQuickFire } from "./SpellQuickFire";

export const hunterSpellsIndex = {
  [SpellsBlueprint.BoltCreationSpell]: spellBoltCreation,
  [SpellsBlueprint.FireBoltCreationSpell]: spellFireBoltCreation,
  [SpellsBlueprint.SpellEagleEyes]: spellEagleEyes,
  [SpellsBlueprint.HunterQuickFire]: spellQuickFire,
};
