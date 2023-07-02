import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemBanana: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Banana,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/banana.png",

  name: "Banana",
  description: "A ripe banana.",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 3,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.MinorEatingEffect,
};
