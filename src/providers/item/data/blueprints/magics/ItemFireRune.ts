import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";

import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectBurning } from "@providers/entityEffects/data/blueprints/entityEffectBurning";
import { container } from "@providers/inversify/container";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import {
  AnimationEffectKeys,
  BasicAttribute,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  MagicPower,
  RangeTypes,
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
  power: MagicPower.Low,
  canSell: false,
  minMagicLevelRequired: 2,
  animationKey: AnimationEffectKeys.HitFire,
  projectileAnimationKey: AnimationEffectKeys.FireBall,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);
    const entityEffectUse = container.get(EntityEffectUse);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireRune, caster);

    const spellCalculator = container.get(SpellCalculator);

    const pointModifier = await spellCalculator.calculateBuffBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 1,
      max: 3,
    });

    await entityEffectUse.applyEntityEffects(target, caster, entityEffectBurning);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -pointModifier * points);

    return points;
  },
  usableEffectDescription: "Deals fire damage to the target",
};
