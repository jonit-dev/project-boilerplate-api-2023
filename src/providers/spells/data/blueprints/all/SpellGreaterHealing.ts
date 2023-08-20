import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys, BasicAttribute, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellGreaterHealing: Partial<ISpell> = {
  key: SpellsBlueprint.GreaterHealingSpell,

  name: "Greater Healing Spell",
  description: "A greater healing spell.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "greater faenya",
  manaCost: 25,
  minLevelRequired: 4,
  minMagicLevelRequired: 4,
  cooldown: 10,
  castingAnimationKey: AnimationEffectKeys.LifeHeal,

  usableEffect: async (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const spellCalculator = container.get(SpellCalculator);

    const percentage = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 20,
      max: 35,
    });

    const totalAmount = (character.maxHealth * percentage) / 100;

    itemUsableEffect.apply(character, EffectableAttribute.Health, totalAmount);
  },
};
