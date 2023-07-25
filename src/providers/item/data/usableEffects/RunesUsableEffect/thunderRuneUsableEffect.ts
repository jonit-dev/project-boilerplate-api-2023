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

export const thunderRuneUsableEffect: IUsableEffectRune = {
  key: UsableEffectsBlueprint.ThunderRuneUsableEffect,
  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.EnergyBoltRune, caster);

    const spellCalculator = container.get(SpellCalculator);

    const pointModifier = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 2,
      max: 4,
    });

    const timeout = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 30,
      max: 60,
    });

    const debuffPercentage = await spellCalculator.calculateBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 20,
      max: 35,
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
        originateFrom: UsableEffectsBlueprint.ThunderRuneUsableEffect,
      });
    }

    let totalPoints = pointModifier * points;
    totalPoints = totalPoints > target.health ? target.health : totalPoints;

    itemUsableEffect.apply(target, EffectableAttribute.Health, -totalPoints);
    return totalPoints;
  },
  usableEffectDescription:
    "Deals a strong energy damage on the target based on your magic level, and also reduces its speed.",
};
