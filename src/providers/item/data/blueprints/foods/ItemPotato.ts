import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

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
  usableEffectKey: UsableEffectsBlueprint.ModerateEatingEffect,
};
