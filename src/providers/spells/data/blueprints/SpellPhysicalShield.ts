import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { container } from "@providers/inversify/container";
import { ItemUseCycle } from "@providers/item/ItemUseCycle";
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

    const timeout = 300;

    await characterSkillBuff.enableTemporaryBuff(character, BasicAttribute.Resistance, 30, timeout);

    new ItemUseCycle(async () => {
      if (character) {
        await animationEffect.sendAnimationEventToCharacter(character, AnimationEffectKeys.PhysicalShield);
      }
    }, timeout / 10);
  },
};
