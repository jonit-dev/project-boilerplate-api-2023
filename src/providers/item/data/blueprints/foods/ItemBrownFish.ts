import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBrownFish: Partial<IItem> = {
  key: FoodsBlueprint.BrownFish,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/brown-fish.png",
  name: "Brown Fish",
  description: "A brown fish that can be caught in rivers and lakes.",
  weight: 1,
  maxStackSize: 100,
  basePrice: 7,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.apply(character, EffectableAttribute.Health, 1.25);
  },
};