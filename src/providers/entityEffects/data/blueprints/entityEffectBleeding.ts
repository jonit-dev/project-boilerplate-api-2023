import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CalculateEffectDamage } from "@providers/entityEffects/CalculateEffectDamage";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EntityEffectBlueprint } from "../types/entityEffectBlueprintTypes";
import { IEntityEffect } from "./entityEffect";

export const entityEffectBleeding: IEntityEffect = {
  key: EntityEffectBlueprint.Bleeding,
  totalDurationMs: 30000,
  intervalMs: 2000,
  probability: 25,
  targetAnimationKey: "wounded",
  type: EntityAttackType.Melee,
  effect: async (target: ICharacter | INPC, attacker: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const calculateEffectDamage = container.get(CalculateEffectDamage);
    const effectDamage = await calculateEffectDamage.calculateEffectDamage(attacker, target);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * effectDamage);

    return effectDamage;
  },
};
