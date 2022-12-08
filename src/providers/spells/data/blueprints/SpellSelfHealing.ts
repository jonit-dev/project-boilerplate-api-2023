import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

export const spellSelfHealing: Partial<ISpell> = {
  key: SpellsBlueprint.SelfHealingSpell,

  name: "Self Healing Spell",
  description: "A self healing spell.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas faenya",
  manaCost: 10,
  minLevelRequired: 2,
  minMagicLevelRequired: 1,
  animationKey: AnimationEffectKeys.LifeHeal,

  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, 10);
  },
};
