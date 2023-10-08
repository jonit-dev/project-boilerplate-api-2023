import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CalculateEffectDamage } from "@providers/entityEffects/CalculateEffectDamage";
import { characterBuffActivator, container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import {
  AnimationEffectKeys,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  MagicPower,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { EntityAttackType, EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { EntityEffectBlueprint } from "../types/entityEffectBlueprintTypes";
import { IEntityEffect } from "./entityEffect";

export const entityEffectVineGrasp: IEntityEffect = {
  key: EntityEffectBlueprint.VineGrasp,
  totalDurationMs: 8000,
  intervalMs: 2000,
  probability: 25,
  targetAnimationKey: AnimationEffectKeys.Rooted,
  type: EntityAttackType.Melee,
  effect: async (target: ICharacter | INPC, attacker: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);
    const calculateEffectDamage = container.get(CalculateEffectDamage);
    const effectDamage = await calculateEffectDamage.calculateEffectDamage(attacker, target, {
      maxBonusDamage: MagicPower.Medium,
    });

    await itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * effectDamage);

    if (attacker.type === EntityType.NPC && target.type === EntityType.Character) {
      await characterBuffActivator.enableTemporaryBuff(target as ICharacter, {
        type: CharacterBuffType.CharacterAttribute,
        trait: CharacterAttributes.Speed,
        buffPercentage: -15,
        durationSeconds: 15,
        durationType: CharacterBuffDurationType.Temporary,
        options: {
          messages: {
            activation: `Your speed is reduced! (-${15}%)`,
            deactivation: "Your speed is back to normal!",
          },
        },
        isStackable: false,
        originateFrom: SpellsBlueprint.VineGrasp,
      });
    }

    return effectDamage;
  },
};
