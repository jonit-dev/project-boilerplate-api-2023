import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { characterBuffActivator, container, spellCalculator } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { BasicAttribute, CharacterBuffDurationType, CharacterBuffType, CraftingSkill } from "@rpg-engine/shared";
import { round } from "lodash";
import { IUsableEffect, UsableEffectsBlueprint } from "../types";

// Life potion
export const lightLifePotionUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.LightLifePotionUsableEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterHealthPercentage = round(character.maxHealth * 0.1); // 10% of char max health

    itemUsableEffect.apply(character, EffectableAttribute.Health, characterHealthPercentage);
  },
  usableEffectDescription: "Restores 10% of life",
};

export const lifePotionUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.LifePotionUsableEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterHealthPercentage = round(character.maxHealth * 0.15); // 15% of char max health

    itemUsableEffect.apply(character, EffectableAttribute.Health, characterHealthPercentage);
  },
  usableEffectDescription: "Restores 15% of life",
};

export const greaterLifePotionUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.GreaterLifePotionUsableEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterHealthPercentage = round(character.maxHealth * 0.25); // 25% of char max health

    itemUsableEffect.apply(character, EffectableAttribute.Health, characterHealthPercentage);
  },
  usableEffectDescription: "Restores 25% of life.",
};

// Mana potion

export const LightManaPotionUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.LightManaPotionUsableEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterManaPercentage = round(character.maxMana * 0.1); // 10% of char max mana

    itemUsableEffect.apply(character, EffectableAttribute.Mana, characterManaPercentage);
  },
  usableEffectDescription: "Restores 10% of mana",
};

export const manaPotionUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.ManaPotionUsableEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterManaPercentage = round(character.maxMana * 0.15); // 15% of char max mana

    itemUsableEffect.apply(character, EffectableAttribute.Mana, characterManaPercentage);
  },
  usableEffectDescription: "Restores 15% of mana",
};
export const greaterManaPotionUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.GreaterManaPotionUsableEffect,
  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const characterManaPercentage = round(character.maxMana * 0.25); // 25% of char max mana

    itemUsableEffect.apply(character, EffectableAttribute.Mana, characterManaPercentage);
  },
  usableEffectDescription: "Restores 25% of mana.",
};

// Other

export const antidotePotionUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.AntidotePotionUsableEffect,
  usableEffect: async (character: ICharacter) => {
    const entityEffectUse = container.get(EntityEffectUse);

    // cure poison effect
    await entityEffectUse.clearEntityEffect(EntityEffectBlueprint.Poison, character);
  },
  usableEffectDescription: "Cures poison effect",
};

export const lightEndurancePotionUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.LightEndurancePotionUsableEffect,
  usableEffect: async (character: ICharacter) => {
    const timeout = await spellCalculator.calculateBasedOnSkillLevel(character, CraftingSkill.Alchemy, {
      min: 10,
      max: 30,
    });

    const buffPercentage = await spellCalculator.calculateBasedOnSkillLevel(character, CraftingSkill.Alchemy, {
      min: 5,
      max: 10,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
    });
  },
  usableEffectDescription: "Temporary resistance buff against physical damage",
};
