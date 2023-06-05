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
  MagicPower,
  RangeTypes,
} from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPoisonRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.PoisonRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/poison-rune.png",
  name: "Poison Rune",
  description: "An ancient poison rune.",
  weight: 0.01,
  maxStackSize: 100,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Low,
  canSell: false,
  minMagicLevelRequired: 2,
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
