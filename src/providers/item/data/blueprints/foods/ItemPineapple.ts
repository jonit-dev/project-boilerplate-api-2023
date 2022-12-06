import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPineapple: Partial<IItem> = {
  key: FoodsBlueprint.Pineapple,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/pineapple.png",
  name: "Pineapple",
  description: "A pineapple that can be found in tropical areas.",
  weight: 1,
  maxStackSize: 25,
  basePrice: 15,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.applyEatingEffect(character, 1.25);
  },
};
