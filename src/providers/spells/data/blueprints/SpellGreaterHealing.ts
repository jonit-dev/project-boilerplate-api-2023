import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

export const spellGreaterHealing: Partial<ISpell> = {
  key: SpellsBlueprint.GreaterHealingSpell,

  name: "Greater Healing Spell",
  description: "A greater healing spell.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "greater faenya",
  manaCost: 30,
  minLevelRequired: 4,
  minMagicLevelRequired: 1,
  animationKey: AnimationEffectKeys.LifeHeal,

  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, 45);
  },
};
