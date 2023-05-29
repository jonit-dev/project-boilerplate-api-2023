import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellBoltCreation } from "./SpellBoltCreation";
import { spellEagleEyes } from "./SpellEagleEyes";
import { spellFireBoltCreation } from "./SpellFireBoltCreation";
import { spellPoisonArrowCreation } from "./SpellPoisonArrowCreation";
import { spellQuickFire } from "./SpellQuickFire";
import { spellFrostArrowCreation } from "./SpellFrostArrowCreation";
import { spellCrimsonArrowCreation } from "./SpellCrimsonArrowCreation";
import { spellEmeraldArrowCreation } from "./SpellEmeraldArrowCreation";

export const hunterSpellsIndex = {
  [SpellsBlueprint.BoltCreationSpell]: spellBoltCreation,
  [SpellsBlueprint.FireBoltCreationSpell]: spellFireBoltCreation,
  [SpellsBlueprint.SpellEagleEyes]: spellEagleEyes,
  [SpellsBlueprint.HunterQuickFire]: spellQuickFire,
  [SpellsBlueprint.PoisonArrowCreationSpell]: spellPoisonArrowCreation,
  [SpellsBlueprint.FrostArrowCreation]: spellFrostArrowCreation,
  [SpellsBlueprint.CrimsonArrowCreation]: spellCrimsonArrowCreation,
  [SpellsBlueprint.EmeraldArrowCreation]: spellEmeraldArrowCreation,
};
