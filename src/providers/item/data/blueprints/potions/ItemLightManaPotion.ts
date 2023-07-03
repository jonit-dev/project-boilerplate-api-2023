import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemLightManaPotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.LightManaPotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/light-mana-potion.png",

  name: "Light Mana Potion",
  description: "A light flask containing blue liquid of a mana potion.",
  weight: 0.5,
  basePrice: 10,
  maxStackSize: 100,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.LightManaPotionUsableEffect,
};
