import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { HitTarget } from "@providers/battle/HitTarget";
import { EntityEffectUse } from "@providers/entityEffects/EntityEffectUse";
import { entityEffectCorruption } from "@providers/entityEffects/data/blueprints/entityEffectCorruption";
import { characterBuffActivator, container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  ISpell,
  MagicPower,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellCorruptionBolt: Partial<ISpell> = {
  key: SpellsBlueprint.CorruptionBolt,
  name: "Corruption Bolt",
  description: "Cast a deadly corruption bolt at your target.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "moe i morgul",
  manaCost: 120,
  minLevelRequired: 15,
  minMagicLevelRequired: 15,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Corruption,
  projectileAnimationKey: AnimationEffectKeys.Dark,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Druid, CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const entityEffectUse = container.get(EntityEffectUse);
    const hitTarget = container.get(HitTarget);
    const spellCalculator = container.get(SpellCalculator);

    await hitTarget.hit(character, target, true, MagicPower.UltraHigh);

    await entityEffectUse.applyEntityEffects(target, character, entityEffectCorruption);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 30,
      max: 60,
    });

    const debuffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 5,
      max: 15,
    });

    if (target.type === "Character") {
      await characterBuffActivator.enableTemporaryBuff(target as ICharacter, {
        type: CharacterBuffType.Skill,
        trait: BasicAttribute.Strength,
        buffPercentage: -debuffPercentage,
        durationSeconds: timeout,
        durationType: CharacterBuffDurationType.Temporary,
        options: {
          messages: {
            activation: ` You feel weakened by corruption (-${debuffPercentage}% strength and resistance)`,
            deactivation: "You're no longer weakened by corruption.",
          },
        },
      });

      await characterBuffActivator.enableTemporaryBuff(target as ICharacter, {
        type: CharacterBuffType.Skill,
        trait: BasicAttribute.Resistance,
        buffPercentage: -debuffPercentage,
        durationSeconds: timeout,
        durationType: CharacterBuffDurationType.Temporary,
        options: {
          messages: {
            skipAllMessages: true,
          },
        },
      });
    }

    return true;
  },
};
