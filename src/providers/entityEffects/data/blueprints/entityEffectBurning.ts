import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER } from "@providers/constants/EntityEffectsConstants";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { TraitGetter } from "@providers/skill/TraitGetter";
import { AnimationEffectKeys, BasicAttribute } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import _ from "lodash";
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

    const traitGetter = container.get(TraitGetter);
    const attackerSkills = attacker.skills as unknown as ISkill;
    const attackerMagicLevel = await traitGetter.getSkillLevelWithBuffs(attackerSkills, BasicAttribute.Magic);
    const attackerLevel = attackerMagicLevel ?? 1;

    const maxDamage = Math.ceil(attackerLevel * ENTITY_EFFECT_DAMAGE_LEVEL_MULTIPLIER);
    const effectDamage = _.random(1, maxDamage);

    itemUsableEffect.apply(target, EffectableAttribute.Health, -1 * effectDamage);

    return effectDamage;
  },
};
