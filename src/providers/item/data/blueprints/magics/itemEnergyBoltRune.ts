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
  MagicPower,
  RangeTypes,
} from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEnergyBoltRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.EnergyBoltRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/energy-bolt-rune.png",
  name: "Energy Bolt Rune",
  description: "An ancient Energy Bolt Rune.",
  weight: 0.01,
  maxStackSize: 100,
  hasUseWith: true,
  canUseOnNonPVPZone: false,

  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Medium,
  minMagicLevelRequired: 3,
  canSell: false,
  animationKey: AnimationEffectKeys.Hit,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.EnergyBoltRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);

    return points;
  },
  usableEffectDescription: "Deals energy damage to the target",
};
