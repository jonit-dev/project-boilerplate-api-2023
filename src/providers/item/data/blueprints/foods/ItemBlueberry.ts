import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { FoodsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemBlueberry: IConsumableItemBlueprint = {
  key: FoodsBlueprint.Blueberry,
  type: ItemType.Consumable,
  subType: ItemSubType.Food,
  textureAtlas: "items",
  texturePath: "foods/blueberry.png",
  name: "Blueberry",
  description:
    "A blueberry is a small, sweet berry that grows in clusters on bushes. Blueberries are a good source of vitamin C and fiber.",
  weight: 0.01,
  maxStackSize: 999,
  basePrice: 2,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.MinorEatingEffect,
};
