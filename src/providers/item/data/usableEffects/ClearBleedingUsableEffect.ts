import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { IUsableEffect, UsableEffectsBlueprint } from "./types";

export const clearBleedingUsableEffect: IUsableEffect = {
  key: UsableEffectsBlueprint.ClearBleedingUsableEffect,
  usableEffect: async (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);
    const entityEffectUse = container.get(EntityEffectUse);

    itemUsableEffect.apply(character, EffectableAttribute.Health, 3);

    // cure bleeding effect
    await entityEffectUse.clearEntityEffect(EntityEffectBlueprint.Bleeding, character);
  },
  usableEffectDescription: "Stops bleeding and restores 3 HP",
};
