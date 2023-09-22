import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemEgg: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Egg,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/egg.png",

  name: "Egg",
  description: "A chicken egg.",
  weight: 0.05,
  maxStackSize: 999,
  basePrice: 2,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.MinorEatingEffect,
};
