import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";

import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectPoison } from "@providers/entityEffects/data/blueprints/entityEffectPoison";
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
import { MagicsBlueprint, PotionsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAcidFlask: IRuneItemBlueprint = {
  key: PotionsBlueprint.AcidFlask,
  type: ItemType.Tool,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/acid-flask.png",
  name: "Acid Flask",
  description: "A corrosive liquid that eats through armor and burns flesh.",
  weight: 0.01,
  maxStackSize: 100,
  basePrice: 20,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: RunePower.Low,
  canSell: false,
  minMagicLevelRequired: 7,
  animationKey: AnimationEffectKeys.HitPoison,
  projectileAnimationKey: AnimationEffectKeys.Green,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.PoisonRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * points);

    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectPoison);

    return points;
  },
  usableEffectDescription: "Deals poison damage to the target",
};
