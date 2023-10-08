import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CalculateEffectDamage } from "@providers/entityEffects/CalculateEffectDamage";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EntityEffectBlueprint } from "../types/entityEffectBlueprintTypes";
import { IEntityEffect } from "./entityEffect";

export const entityEffectBurning: IEntityEffect = {
  key: EntityEffectBlueprint.Burning,
  totalDurationMs: 40000,
  intervalMs: 2000,
  probability: 25,
  targetAnimationKey: AnimationEffectKeys.Burn,
  type: EntityAttackType.Melee,
  effect: async (target: ICharacter | INPC, attacker: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const calculateEffectDamage = container.get(CalculateEffectDamage);
    const effectDamage = await calculateEffectDamage.calculateEffectDamage(attacker, target);

    await itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * effectDamage);

    return effectDamage;
  },
};
