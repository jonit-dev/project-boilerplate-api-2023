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

export const itemCorrosiveElixir: IRuneItemBlueprint = {
  key: PotionsBlueprint.CorrosiveElixir,
  type: ItemType.Tool,
  subType: ItemSubType.Potion,
  textureAtlas: "items",
  texturePath: "potions/corrosive-elixir.png",
  name: "Corrosive Elixir",
  description: "Granting resistance to acid attacks and imbuing melee strikes with a corrosive touch.",
  weight: 0.01,
  maxStackSize: 100,
  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: RunePower.High,
  canSell: false,
  minMagicLevelRequired: 5,
  basePrice: 80,
  animationKey: AnimationEffectKeys.HitPoison,
  projectileAnimationKey: AnimationEffectKeys.Green,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.PoisonRune, caster);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -3 * points);

    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectPoison);

    return points;
  },
  usableEffectDescription: "Deals poison damage to the target",
};
