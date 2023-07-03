import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemLightLifePotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.LightLifePotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/light-life-potion.png",

  name: "Light Life Potion",
  description: "A small flask containing an elixir of life.",
  weight: 0.5,
  basePrice: 10,
  maxStackSize: 100,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.LightLifePotionUsableEffect,
};
