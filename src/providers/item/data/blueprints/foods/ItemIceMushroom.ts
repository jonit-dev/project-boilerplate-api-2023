import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemIceMushroom: IConsumableItemBlueprint = {
  key: FoodsBlueprint.IceMushroom,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/ice-mushroom.png",
  name: "Ice Mushroom",
  description: "An edible mushroom that can be eaten to restore health.",
  weight: 0.25,
  maxStackSize: 100,
  basePrice: 5,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.ModerateEatingEffect,
};
