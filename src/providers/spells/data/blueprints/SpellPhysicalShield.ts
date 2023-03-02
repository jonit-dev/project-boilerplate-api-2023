import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

export const spellPhysicalShield: Partial<ISpell> = {
  key: SpellsBlueprint.SpellPhysicalShield,
  name: "Self Physical Shield",
  description: "A Self Physical Shield.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas zirh",
  manaCost: 60,
  minLevelRequired: 7,
  minMagicLevelRequired: 7,
  animationKey: AnimationEffectKeys.PhysicalShield,

  usableEffect: async (character: ICharacter) => {
    const characterSkillBuff = container.get(CharacterSkillBuff);
    const animationEffect = container.get(AnimationEffect);

    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 5, 0), 180);

    await characterSkillBuff.enableTemporaryBuff(character, BasicAttribute.Resistance, 30, timeout);

    if (character) {
      await animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.PhysicalShield);
    }
  },
};
