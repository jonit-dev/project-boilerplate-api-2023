import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectBurning } from "@providers/entityEffects/data/blueprints/entityEffectBurning";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { BasicAttribute, MagicsBlueprint } from "@rpg-engine/shared";
import { IUsableEffectRune, UsableEffectsBlueprint } from "../types";

export const fireRuneUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.FireRuneUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.FireRune, caster);

    const spellCalculator = container.get(SpellCalculator);

    const pointModifier = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 1,
      max: 3,
    });

    let totalPoints = pointModifier * points;
    totalPoints = totalPoints > target.health ? target.health : totalPoints;

    itemUsableEffect.apply(target, EffectableAttribute.Health, -totalPoints);
    return totalPoints;
  },
  usableEffectDescription: "Deals fire damage to the target",
  usableEntityEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const entityEffectUse = container.get(EntityEffectUse);
    await entityEffectUse.applyEntityEffects(target, caster, entityEffectBurning);
  },
};
