import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemChickensMeat: IConsumableItemBlueprint = {
  key: FoodsBlueprint.ChickensMeat,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/chickens-meat.png",

  name: "Chickens Meat",
  description: "Chicken meat can be cooked and eaten to restore health",
  weight: 0.25,
  maxStackSize: 999,
  basePrice: 9,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.StrongEatingEffect,
};
