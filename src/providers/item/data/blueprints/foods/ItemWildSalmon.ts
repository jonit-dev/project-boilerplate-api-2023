import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemWildSalmon: IConsumableItemBlueprint = {
  key: FoodsBlueprint.WildSalmon,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/wild-salmon.png",
  name: "Wild Salmon",
  description: "A common fish that can be caught in rivers and it's the favorite food of bears.",
  weight: 1,
  maxStackSize: 999,
  basePrice: 6,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.StrongEatingEffect,
};
