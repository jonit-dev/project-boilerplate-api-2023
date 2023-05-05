import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import {
  AnimationEffectKeys,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  RangeTypes,
  RunePower,
} from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.CorruptionRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/corruption-rune.png",
  name: "Corruption Rune",
  description: "The forbidden Corruption of Xoranth, the dark God, corrupts all who succumb to its influence",
  weight: 0.01,
  maxStackSize: 100,

  hasUseWith: true,
  canUseOnNonPVPZone: false,
  useWithMaxDistanceGrid: RangeTypes.High,
  power: RunePower.UltraHigh,
  canSell: false,
  minMagicLevelRequired: 10,
  animationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.DarkRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);

    return points;
  },
  usableEffectDescription: "Deals corruption damage to the target",
};
