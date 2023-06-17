import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { EffectableAttribute, ItemUsableEffect } from "@providers/item/helper/ItemUsableEffect";
import { calculateItemUseEffectPoints } from "@providers/useWith/libs/UseWithHelper";

import { characterBuffActivator, container } from "@providers/inversify/container";
import { SpellCalculator } from "@providers/spells/data/abstractions/SpellCalculator";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  IRuneItemBlueprint,
  ItemSubType,
  ItemType,
  MagicPower,
  RangeTypes,
} from "@rpg-engine/shared";
import { MagicsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemThunderRune: IRuneItemBlueprint = {
  key: MagicsBlueprint.ThunderRune,
  type: ItemType.Tool,
  subType: ItemSubType.Magic,
  textureAtlas: "items",
  texturePath: "magics/thunder-rune.png",
  name: "Thunder Rune",
  description: "An ancient thunder rune.",
  weight: 0.01,
  maxStackSize: 100,

  canUseOnNonPVPZone: false,
  hasUseWith: true,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  power: MagicPower.Medium,
  canSell: false,
  minMagicLevelRequired: 5,
  animationKey: AnimationEffectKeys.Energy,
  projectileAnimationKey: AnimationEffectKeys.Green,

  usableEffect: async (caster: ICharacter, target: ICharacter | INPC) => {
    const itemUsableEffect = container.get(ItemUsableEffect);

    const points = await calculateItemUseEffectPoints(MagicsBlueprint.EnergyBoltRune, caster);

    const spellCalculator = container.get(SpellCalculator);

    const pointModifier = await spellCalculator.calculateBuffBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 2,
      max: 4,
    });

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(caster, BasicAttribute.Magic, {
      min: 30,
      max: 60,
    });

    const debuffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(caster, BasicAttribute.Magic, {
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
      });
    }

    itemUsableEffect.apply(target, EffectableAttribute.Health, -pointModifier * points);

    return points;
  },
  usableEffectDescription:
    "Deals a strong energy damage on the target based on your magic level, and also reduces its speed.",
};
