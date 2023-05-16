import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys, ISpell, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";

export const spellSelfHealing: Partial<ISpell> = {
  key: SpellsBlueprint.SelfHealingSpell,

  name: "Self Healing Spell",
  description: "A self healing spell.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas faenya",
  manaCost: 10,
  minLevelRequired: 2,
  minMagicLevelRequired: 1,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.LifeHeal,

  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.apply(character, EffectableAttribute.Health, 10);
  },
};
