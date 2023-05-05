import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import { ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPotato: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Potato,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/potato.png",

  name: "Potato",
  description:
    "The Potato is a vegetable that grows underground in the form of a tuber. It comes in a variety of colors, sizes, and shapes, depending on the type of potato.",
  weight: 1,
  maxStackSize: 100,
  basePrice: 6,
  canSell: false,

  usableEffect: (character: ICharacter) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    itemUsableEffect.applyEatingEffect(character, 5);
  },
  usableEffectDescription: "Restores 5 HP and Mana 5 times",
};
