import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemLifePotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.LifePotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/life-potion.png",

  name: "Life Potion",
  description: "A flask containing an elixir of life.",
  weight: 0.5,
  basePrice: 20,
  maxStackSize: 100,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.LifePotionUsableEffect,
};
