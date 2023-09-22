import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemRawBeefSteak: IConsumableItemBlueprint = {
  key: FoodsBlueprint.RawBeefSteak,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/raw-beef-steak.png",
  name: "Raw Beef Steak",
  description: "A raw beef steak that can be used for cooking, but shouldn't be consumed raw.",
  weight: 3,
  maxStackSize: 999,
  basePrice: 20,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.PoisonEatingEffect,
};
