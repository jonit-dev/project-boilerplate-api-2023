import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER } from "@providers/constants/EntityEffectsConstants";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { EntityEffectBlueprint } from "../types/entityEffectBlueprintTypes";
import { IEntityEffect } from "./entityEffect";
import _ from "lodash";
import { AnimationEffectKeys } from "@rpg-engine/shared";

export const entityEffectPoison: IEntityEffect = {
  key: EntityEffectBlueprint.Poison,
  totalDurationMs: 60000,
  intervalMs: 5000,
  probability: 20, // 20% chance of triggering it for the NPC that attacks a target
  targetAnimationKey: AnimationEffectKeys.HitPoison,
  type: EntityAttackType.Melee,
  effect: (target: ICharacter | INPC, attacker: INPC) => {
    const attackerSkills = attacker.skills as unknown as ISkill;
    const attackerLevel = attackerSkills?.level ?? 1;

    const maxDamage = Math.ceil(attackerLevel * ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER);
    const effectDamage = _.random(1, maxDamage);

    ItemUsableEffect.apply(target, EffectableAttribute.Health, -1 * effectDamage);

    return effectDamage;
  },
};
