import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import { BasicAttribute, MagicsBlueprint } from "@rpg-engine/shared";
import { IUsableEffectRune, UsableEffectsBlueprint } from "../types";

export const darkRuneUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.DarkRuneUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.DarkRune, caster);

    const spellCalculator = container.get(SpellCalculator);

    const pointModifier = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 2,
      max: 4,
    });

    let totalPoints = pointModifier * points;
    totalPoints = totalPoints > target.health ? target.health : totalPoints;

    itemUsableEffect.apply(target, EffectableAttribute.Health, -totalPoints);
    console.log("target.health", target.health);
    return totalPoints;
  },
  usableEffectDescription: "Deals dark damage to the target",
};
