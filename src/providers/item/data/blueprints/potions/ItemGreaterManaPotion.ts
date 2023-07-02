import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemGreaterManaPotion: IConsumableItemBlueprint = {
  key: PotionsBlueprint.GreaterManaPotion,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/greater-mana-potion.png",

  name: "Greater Mana Potion",
  description: "A greater flask containing blue liquid of a mana potion.",
  weight: 0.5,
  basePrice: 40,
  maxStackSize: 100,
  canSell: false,
  usableEffectKey: UsableEffectsBlueprint.GreaterManaPotionUsableEffect,
};
