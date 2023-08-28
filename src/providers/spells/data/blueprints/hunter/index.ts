import { SpellsBlueprint } from "@rpg-engine/shared";
import { spellArrowStorm } from "./SpellArrowstorm";
import { spellBoltCreation } from "./SpellBoltCreation";
import { spellCrimsonArrowCreation } from "./SpellCrimsonArrowCreation";
import { spellEagleEyes } from "./SpellEagleEyes";
import { spellEmeraldArrowCreation } from "./SpellEmeraldArrowCreation";
import { spellFireBoltCreation } from "./SpellFireBoltCreation";
import { spellFrostArrowCreation } from "./SpellFrostArrowCreation";
import { spellPoisonArrowCreation } from "./SpellPoisonArrowCreation";
import { spellQuickFire } from "./SpellQuickFire";
import { spellWildfireVolley } from "./SpellWildfireVolley";

export const hunterSpellsIndex = {
  [SpellsBlueprint.BoltCreationSpell]: spellBoltCreation,
  [SpellsBlueprint.FireBoltCreationSpell]: spellFireBoltCreation,
  [SpellsBlueprint.SpellEagleEyes]: spellEagleEyes,
  [SpellsBlueprint.HunterQuickFire]: spellQuickFire,
  [SpellsBlueprint.PoisonArrowCreationSpell]: spellPoisonArrowCreation,
  [SpellsBlueprint.FrostArrowCreation]: spellFrostArrowCreation,
  [SpellsBlueprint.CrimsonArrowCreation]: spellCrimsonArrowCreation,
  [SpellsBlueprint.EmeraldArrowCreation]: spellEmeraldArrowCreation,
  [SpellsBlueprint.WildfireVolley]: spellWildfireVolley,
  [SpellsBlueprint.Arrowstorm]: spellArrowStorm,
};
