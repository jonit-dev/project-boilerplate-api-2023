import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemPineapple: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Pineapple,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/pineapple.png",
  name: "Pineapple",
  description: "A pineapple that can be found in tropical areas.",
  weight: 1,
  maxStackSize: 50,
  basePrice: 7,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.StrongEatingEffect,
};
