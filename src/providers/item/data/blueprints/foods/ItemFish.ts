import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemFish: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Fish,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/fish.png",
  name: "Fish",
  description: "A dull fish.",
  weight: 0.2,
  maxStackSize: 100,
  basePrice: 3,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.ModerateEatingEffect,
};
