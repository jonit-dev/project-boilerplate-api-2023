import {
  AnimationEffectKeys,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  MagicPower,
  RangeTypes,
} from "@rpg-engine/shared";
import { PotionsBlueprint } from "../../types/itemsBlueprintTypes";
import { UsableEffectsBlueprint } from "../../usableEffects/types";

export const itemVenomousVial: IRuneItemBlueprint = {
  key: PotionsBlueprint.VenomousVial,
  type: ItemType.Tool,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/venomous-vial.png",
  name: "Venomous Vial",
  description: "An explosive vial releasing a noxious cloud that poisons enemies and weakens their vitality.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 45,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Medium,
  canSell: false,

  minMagicLevelRequired: 4,
  animationKey: AnimationEffectKeys.HitPoison,
  projectileAnimationKey: AnimationEffectKeys.Green,

  usableEffectKey: UsableEffectsBlueprint.LightPoisonVialUsableEffect,
};
