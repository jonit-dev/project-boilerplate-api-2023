import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemBananaBunch: IConsumableItemBlueprint = {
  key: FoodsBlueprint.BananaBunch,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/banana-bunch.png",

  name: "Banana Bunch",
  description: "A bundle of ripe bananas.",
  weight: 0.03,
  maxStackSize: 999,
  basePrice: 5,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.StrongEatingEffect,
};
