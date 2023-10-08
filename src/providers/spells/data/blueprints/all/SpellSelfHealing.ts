import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys, BasicAttribute, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellSelfHealing: Partial<ISpell> = {
  key: SpellsBlueprint.SelfHealingSpell,

  name: "Self Healing Spell",
  description: "A self healing spell.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas faenya",
  manaCost: 20,
  minLevelRequired: 2,
  minMagicLevelRequired: 1,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.LifeHeal,

  usableEffect: async (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const spellCalculator = container.get(SpellCalculator);

    const percentage = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 10,
      max: 15,
    });

    const totalAmount = (character.maxHealth * percentage) / 100;

    await itemUsableEffect.apply(character, EffectableAttribute.Health, totalAmount);
  },
};
