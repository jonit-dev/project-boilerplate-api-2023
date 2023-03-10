import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { container } from "@providers/inversify/container";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightAntidote: Partial<IItem> = {
  key: PotionsBlueprint.LightAntidote,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/light-antidote.png",
  name: "Light Antidote",
  description: "A small flask containing antidote against poison.",
  weight: 0.04,
  basePrice: 15,
  maxStackSize: 100,
  usableEffect: async (character: ICharacter) => {
    const entityEffectUse = container.get(EntityEffectUse);

    // cure poison effect
    await entityEffectUse.clearEntityEffect(EntityEffectBlueprint.Poison, character);
  },
};
