import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemBrownFish: IConsumableItemBlueprint = {
  key: FoodsBlueprint.BrownFish,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/brown-fish.png",
  name: "Brown Fish",
  description: "A brown fish that can be caught in rivers and lakes.",
  weight: 1,
  maxStackSize: 999,
  basePrice: 3,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.ModerateEatingEffect,
};
