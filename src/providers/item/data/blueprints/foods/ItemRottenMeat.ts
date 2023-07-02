import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemRottenMeat: IConsumableItemBlueprint = {
  key: FoodsBlueprint.RottenMeat,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/rotten-meat.png",
  name: "Rotten Meat",
  description: "A piece of rotten meat. Don't eat it!",
  weight: 0.25,
  maxStackSize: 50,
  basePrice: 1,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.PoisonEatingEffect,
};
