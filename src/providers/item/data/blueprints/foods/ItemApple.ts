import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemApple: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Apple,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/apple.png",

  name: "Apple",
  description: "A red apple.",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 2,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.MinorEatingEffect,
};
