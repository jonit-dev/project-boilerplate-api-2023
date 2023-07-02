import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemManaPotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.ManaPotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/mana-potion.png",

  name: "Mana Potion",
  description: "A flask containing blue liquid of a mana potion.",
  weight: 0.5,
  basePrice: 20,
  maxStackSize: 100,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.ManaPotionUsableEffect,
};
