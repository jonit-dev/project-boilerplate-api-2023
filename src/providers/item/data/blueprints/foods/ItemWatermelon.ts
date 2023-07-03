import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemWatermelon: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Watermelon,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/watermelon.png",
  name: "Watermelon",
  description: "A fruit that can be found in tropical areas.",
  weight: 0.5,
  maxStackSize: 100,
  basePrice: 4,
  canSell: false,

  usableEffectKey: UsableEffectsBlueprint.ModerateEatingEffect,
};
