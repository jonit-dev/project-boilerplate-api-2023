import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemMilk: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Milk,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/milk.png",
  name: "Milk",
  description: "A milk bottle.",
  weight: 0.05,
  maxStackSize: 999,
  basePrice: 4,
  canSell: true,
  usableEffectKey: UsableEffectsBlueprint.SuperStrongEatingEffect,
};
