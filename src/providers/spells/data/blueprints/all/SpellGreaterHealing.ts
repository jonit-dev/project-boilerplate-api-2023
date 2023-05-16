import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";

export const spellGreaterHealing: Partial<ISpell> = {
  key: SpellsBlueprint.GreaterHealingSpell,

  name: "Greater Healing Spell",
  description: "A greater healing spell.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "greater faenya",
  manaCost: 30,
  minLevelRequired: 4,
  minMagicLevelRequired: 4,
  cooldown: 15,
  castingAnimationKey: AnimationEffectKeys.LifeHeal,

  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.apply(character, EffectableAttribute.Health, 45);
  },
};
