import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemSalmon: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Salmon,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/salmon.png",

  name: "Salmon",
  description: "A fresh salmon fish.",
  weight: 0.2,
  maxStackSize: 999,
  basePrice: 7,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.SuperStrongEatingEffect,
};
