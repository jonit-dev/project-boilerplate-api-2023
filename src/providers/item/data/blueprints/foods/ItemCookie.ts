import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemCookie: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Cookie,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/cookie.png",

  name: "Cookie",
  description: "A baked cookie.",
  weight: 0.05,
  maxStackSize: 100,
  basePrice: 2,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.MinorEatingEffect,
};
