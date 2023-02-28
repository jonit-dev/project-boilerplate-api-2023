import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { container } from "@providers/inversify/container";
import { ItemUseCycle } from "@providers/item/ItemUseCycle";
import { AnimationEffectKeys, BasicAttribute, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

export const spellMagicShield: Partial<ISpell> = {
  key: SpellsBlueprint.SpellMagicShield,
  name: "Self Magic Shield",
  description: "A Self Magic Shield.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas kalkan",
  manaCost: 60,
  minLevelRequired: 8,
  minMagicLevelRequired: 8,
  animationKey: AnimationEffectKeys.MagicShield,

  usableEffect: async (character: ICharacter) => {
    const characterSkillBuff = container.get(CharacterSkillBuff);
    const animationEffect = container.get(AnimationEffect);

    const timeout = 300;

    await characterSkillBuff.enableTemporaryBuff(character, BasicAttribute.MagicResistance, 30, timeout);

    new ItemUseCycle(async () => {
      if (character) {
        await animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.MagicShield);
      }
    }, timeout / 10);
  },
};
