import { IConsumableItemBlueprint, ItemSubType, ItemType } from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemLightAntidote: IConsumableItemBlueprint = {
  key: PotionsBlueprint.LightAntidote,
  type: ItemType.Consumable,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/light-antidote.png",
  name: "Light Antidote",
  description: "A small flask containing antidote against poison.",
  weight: 0.04,
  basePrice: 15,
  maxStackSize: 100,
  usableEffectKey: UsableEffectsBlueprint.AntidotePotionUsableEffect,
};
