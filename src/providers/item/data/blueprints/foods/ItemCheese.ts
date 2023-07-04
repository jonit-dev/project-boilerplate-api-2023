import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemCheese: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Cheese,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/cheese.png",

  name: "Cheese",
  description: "A cheese wheel.",
  weight: 0.3,
  maxStackSize: 100,
  basePrice: 5,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.ModerateEatingEffect,
};
