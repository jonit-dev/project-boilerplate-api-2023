import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SPELL_AREA_FULL_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { entityEffectCorruption } from "@providers/entityEffects/data/blueprints/entityEffectCorruption";
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

export const spellCorruptionWave: Partial<ISpell> = {
  key: SpellsBlueprint.CorruptionWave,
  name: "Corruption Wave",
  description: "Unleashes a dark, spiraling wave of energy that radiates outward from the caste",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "mornië naltalma",
  manaCost: 130,
  minLevelRequired: 15,
  minMagicLevelRequired: 12,
  cooldown: 40,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Corruption,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const spellArea = container.get(SpellArea);

    await spellArea.cast(character, target, MagicPower.High, {
      effectAnimationKey: AnimationEffectKeys.Corruption,
      entityEffect: entityEffectCorruption,
      spellAreaGrid: SPELL_AREA_FULL_BLAST_RADIUS,
    });

    return true;
  },
};
