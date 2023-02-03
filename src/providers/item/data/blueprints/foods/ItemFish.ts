import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFish: Partial<IItem> = {
  key: FoodsBlueprint.Fish,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/fish.png",
  name: "Fish",
  description: "A dull fish.",
  weight: 0.2,
  maxStackSize: 100,
  basePrice: 4,
  canSell: false,

  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.applyEatingEffect(character, 1);
  },
};
