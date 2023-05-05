import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";

import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  RangeTypes,
  RunePower,
} from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.FireRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/fire-rune.png",
  name: "Fire Rune",
  description: "An ancient fire rune.",
  weight: 0.01,
  maxStackSize: 100,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: RunePower.Low,
  canSell: false,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.HitFire,
  projectileAnimationKey: AnimationEffectKeys.FireBall,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);

    return points;
  },
  usableEffectDescription: "Deals fire damage to the target",
};
