import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCheese: Partial<IItem> = {
  key: FoodsBlueprint.Cheese,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/cheese.png",

  name: "Cheese",
  description: "A cheese wheel.",
  weight: 1,
  maxStackSize: 10,
  basePrice: 100,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.applyEatingEffect(character, 10);
  },
};
