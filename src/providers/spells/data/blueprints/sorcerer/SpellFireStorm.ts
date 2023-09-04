import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SPELL_AREA_MEDIUM_BLAST_RADIUS } from "@providers/constants/SpellConstants";
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

export const spellFireStorm: Partial<ISpell> = {
  key: SpellsBlueprint.FireStorm,
  name: "FireStorm",
  description: "Unleashes a turbulent maelstrom of flames, engulfing a targeted area with destructive heat.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "naur ruine",
  manaCost: 80,
  minLevelRequired: 12,
  minMagicLevelRequired: 8,
  cooldown: 30,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Burn,
  projectileAnimationKey: AnimationEffectKeys.FireBall,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);

    await spellArea.cast(character, target, MagicPower.Medium, {
      effectAnimationKey: AnimationEffectKeys.HitFire,
      entityEffect: entityEffectBurning,
      spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
    });

    return true;
  },
};
