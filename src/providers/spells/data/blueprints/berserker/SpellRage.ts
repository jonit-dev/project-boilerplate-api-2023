import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  ISpell,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";

export const spellRage: Partial<ISpell> = {
  key: SpellsBlueprint.BerserkerRage,
  name: "Fury",
  description:
    "This spell unleashes a primal fury, imbuing the caster with untold strength and recklessness, but at a great cost to their defensive capabilities",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "furore",
  manaCost: 110,
  minLevelRequired: 12,
  minMagicLevelRequired: 10,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.Burn,
  characterClass: [CharacterClass.Berserker],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const skills = (await Skill.findById(character.skills).lean().select("strength dexterity")) as ISkill;

    const characterStrength = skills?.strength.level;
    const characterDexterity = skills?.dexterity.level;

    const timeoutWeightedAverage = characterStrength * 0.6 + characterDexterity * 0.4;
    const timeout = Math.min(Math.max(timeoutWeightedAverage * 2, 20), 120);

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage: 50, // increase strength by 30%
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      options: {
        messages: {
          activation:
            "Berserker's rage has been activated! Your strength has been increased (but your resistance was reduced)!",
          deactivation: "Berserker's Rage has been deactivated!",
        },
      },
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: -50, // reduce resistance by 50%
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      options: {
        messages: {
          skipAllMessages: true,
        },
      },
    });
  },
};
