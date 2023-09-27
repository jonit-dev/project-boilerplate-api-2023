import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { SPELL_AREA_MEDIUM_BLAST_RADIUS } from "@providers/constants/SpellConstants";
import { container } from "@providers/inversify/container";
import { SpellArea } from "@providers/spells/area-spells/SpellArea";
import {
  AnimationEffectKeys,
  CharacterClass,
  EntityType,
  ISpell,
  MagicPower,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";

export const spellFocusSwitft: Partial<ISpell> = {
  key: SpellsBlueprint.FocusSwift,
  name: "Focus Swift",
  description: "Provoke the enemy so that they focus their attacks on you",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "cuio tenna",
  manaCost: 40,
  minLevelRequired: 25,
  minMagicLevelRequired: 10,
  cooldown: 25,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Dark,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Warrior, CharacterClass.Berserker],

  usableEffect: async (character: ICharacter, target: INPC) => {
    const spellArea = container.get(SpellArea);

    await spellArea.cast(character, target, MagicPower.UltraLow, {
      effectAnimationKey: AnimationEffectKeys.HitDark,
      spellAreaGrid: SPELL_AREA_MEDIUM_BLAST_RADIUS,
      isAttackSpell: false,
      excludeEntityTypes: [EntityType.Character],
      customFn: async (target: ICharacter | INPC) => {
        const newTarget = character._id;
        await NPC.updateOne({ _id: target._id }, { $set: { targetCharacter: newTarget } });
      },
    });
    return true;
  },
};
