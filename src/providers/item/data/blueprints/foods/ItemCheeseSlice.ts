import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCheeseSlice: Partial<IItem> = {
  key: FoodsBlueprint.CheeseSlice,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/cheese-slice.png",

  name: "Cheese Slice",
  description: "A thick slice of yellow cheese.",
  weight: 0.1,
  maxStackSize: 50,
  basePrice: 10,
  canSell: false,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.applyEatingEffect(character, 1);
  },
};
