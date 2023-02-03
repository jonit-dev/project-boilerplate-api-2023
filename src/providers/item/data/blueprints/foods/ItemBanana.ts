import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBanana: Partial<IItem> = {
  key: FoodsBlueprint.Banana,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/banana.png",

  name: "Banana",
  description: "A ripe banana.",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 10,
  canSell: false,
  usableEffect: (character: ICharacter) => {
    ItemUsableEffect.applyEatingEffect(character, 1);
  },
};
