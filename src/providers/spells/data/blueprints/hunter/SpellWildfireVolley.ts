import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";

import { SPELL_AREA_DIAMOND_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectBurning } from "@providers/entityEffects/data/blueprints/entityEffectBurning";
import { container } from "@providers/inversify/container";
import { SpellArea } from "@providers/spells/area-spells/SpellArea";
import {
  AnimationEffectKeys,
  CharacterClass,
  ISpell,
  MagicPower,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";

export const spellWildfireVolley: Partial<ISpell> = {
  key: SpellsBlueprint.WildfireVolley,
  name: "wildfire Volley",
  description:
    "Ignites the very air, conjuring a torrent of blazing projectiles that rain down upon the chosen area. Each fiery missile explodes on impact, engulfing the surroundings in searing flames and leaving devastation in its wake.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "nára vilya lócalahtie",
  manaCost: 100,
  minLevelRequired: 15,
  minMagicLevelRequired: 9,
  cooldown: 90,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Burn,
  projectileAnimationKey: AnimationEffectKeys.QuickFire,
  characterClass: [CharacterClass.Hunter],
  maxDistanceGrid: RangeTypes.High,

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);

    await spellArea.cast(character, target, MagicPower.UltraHigh, {
      effectAnimationKey: AnimationEffectKeys.HitFire,
      entityEffect: entityEffectBurning,
      spellAreaGrid: SPELL_AREA_DIAMOND_BLAST_RADIUS,
    });

    return true;
  },
};
