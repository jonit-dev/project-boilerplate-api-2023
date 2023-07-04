import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemRedMeat: IConsumableItemBlueprint = {
  key: FoodsBlueprint.RedMeat,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/red-meat.png",
  name: "Red meat",
  description: "This is a red meat from an animal. You can eat it to restore your health.",
  weight: 1,
  maxStackSize: 100,
  basePrice: 10,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.SuperStrongEatingEffect,
};
