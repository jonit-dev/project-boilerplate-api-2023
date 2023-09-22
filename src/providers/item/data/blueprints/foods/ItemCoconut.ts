import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemCoconut: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Coconut,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/coconut.png",
  name: "Coconut",
  description: "A fruit that can be found in tropical areas.",
  weight: 0.5,
  maxStackSize: 999,
  basePrice: 4,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.ModerateEatingEffect,
};
