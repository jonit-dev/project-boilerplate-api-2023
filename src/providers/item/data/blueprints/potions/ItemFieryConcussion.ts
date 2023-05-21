import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";

import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectBurning } from "@providers/entityEffects/data/blueprints/entityEffectBurning";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  RangeTypes,
  RunePower,
} from "@rpg-engine/shared";
import { MagicsBlueprint, PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFieryConcussion: IRuneItemBlueprint = {
  key: PotionsBlueprint.FieryConcussion,
  type: ItemType.Tool,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/fiery-concussion.png",
  name: "Fiery Concussion",
  description: "Ignite chaos with a fiery blast, engulfing enemies in a searing wave of heat and destructive force.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 40,
  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: RunePower.Medium,
  canSell: false,
  minMagicLevelRequired: 12,
  animationKey: AnimationEffectKeys.HitFire,
  projectileAnimationKey: AnimationEffectKeys.FireBall,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -2.5 * points);

    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectBurning);

    return points;
  },
  usableEffectDescription: "Deals fire damage to the target",
};
