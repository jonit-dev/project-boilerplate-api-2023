import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER } from "@providers/constants/EntityEffectsConstants";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { AnimationEffectKeys } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import _ from "lodash";
import { EntityEffectBlueprint } from "../types/entityEffectBlueprintTypes";
import { IEntityEffect } from "./entityEffect";

export const entityEffectFreezing: IEntityEffect = {
  key: EntityEffectBlueprint.Freezing,
  totalDurationMs: 50000,
  intervalMs: 2000,
  probability: 25,
  targetAnimationKey: AnimationEffectKeys.Freeze,
  type: EntityAttackType.Melee,
  effect: (target: ICharacter | INPC, attacker: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const attackerSkills = attacker.skills as unknown as ISkill;
    const attackerLevel = attackerSkills?.level ?? 1;

    const maxDamage = Math.ceil(attackerLevel * ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER);
    const effectDamage = _.random(1, maxDamage);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * effectDamage);

    return effectDamage;
  },
};
