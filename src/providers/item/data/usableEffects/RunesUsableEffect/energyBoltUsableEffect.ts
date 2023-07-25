import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { characterBuffActivator, container } from "@providers/inversify/container";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";
import {
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  MagicsBlueprint,
} from "@rpg-engine/shared";
import { IUsableEffectRune, UsableEffectsBlueprint } from "../types";

export const energyBoltRune: IUsableEffectRune = {
  key: UsableEffectsBlueprint.EnergyBoltRuneUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.EnergyBoltRune, caster);

    const spellCalculator = container.get(SpellCalculator);

    const pointModifier = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 1,
      max: 2,
    });

    const timeout = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 30,
      max: 60,
    });

    const debuffPercentage = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 10,
      max: 25,
    });

    if (target.type === "Character") {
      await characterBuffActivator.enableTemporaryBuff(target as ICharacter, {
        type: CharacterBuffType.CharacterAttribute,
        trait: CharacterAttributes.Speed,
        buffPercentage: -debuffPercentage,
        durationSeconds: timeout,
        durationType: CharacterBuffDurationType.Temporary,
        options: {
          messages: {
            activation: `You're electrified, and your speed is reduced! (-${debuffPercentage}%)`,
            deactivation: "You're no longer electrified!",
          },
        },
        isStackable: false,
        originateFrom: UsableEffectsBlueprint.EnergyBoltRuneUsableEffect,
      });
    }

    let totalPoints = pointModifier * points;
    totalPoints = totalPoints > target.health ? target.health : totalPoints;

    itemUsableEffect.apply(target, EffectableAttribute.Health, -totalPoints);

    return totalPoints;
  },
  usableEffectDescription: "Deals energy damage to the target",
};
