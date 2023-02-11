import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPotato: Partial<IItem> = {
  key: FoodsBlueprint.Potato,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/potato.png",

  name: "Potato",
  description:
    "The Potato is a vegetable that grows underground in the form of a tuber. It comes in a variety of colors, sizes, and shapes, depending on the type of potato.",
  weight: 10,
  maxStackSize: 100,
  basePrice: 10,
  canSell: false,

  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 5);
  },
};
