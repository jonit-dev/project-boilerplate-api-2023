import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuff } from "@providers/character/characterBuff/CharacterBuff";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterAttributes,
  CharacterClass,
  SpellCastingType,
} from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellFrenzy: Partial<ISpell> = {
  key: SpellsBlueprint.BerserkerFrenzy,
  name: "Frenzy",
  description: "A spell that causes a frenzy by increasing your attack speed but lowering your defense.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "kartal insanus",
  manaCost: 120,
  minLevelRequired: 15,
  minMagicLevelRequired: 10,
  cooldown: 60,
  animationKey: AnimationEffectKeys.QuickFire,
  characterClass: [CharacterClass.Berserker],

  usableEffect: async (character: ICharacter) => {
    const characterBuff = container.get(CharacterBuff);

    const skills = (await Skill.findById(character.skills).lean().select("strength dexterity")) as ISkill;

    const characterStrength = skills?.strength.level;
    const characterDexterity = skills?.dexterity.level;

    const timeoutWeightedAverage = characterStrength * 0.6 + characterDexterity * 0.4;
    const timeout = Math.min(Math.max(timeoutWeightedAverage * 2, 20), 120);

    await characterBuff.enableTemporaryBuff(character, {
      type: "characterAttribute",
      trait: CharacterAttributes.AttackIntervalSpeed,
      buffPercentage: -30, // reduce attack interval speed by 30%
      durationSeconds: timeout,
      durationType: "temporary",
      options: {
        messages: {
          activation:
            "Berserker's Frenzy has been activated! Your attack speed has been increased (but your resistance was reduced)!",
          deactivation: "Berserker's Frenzy has been deactivated!",
        },
      },
    });

    await characterBuff.enableTemporaryBuff(character, {
      type: "skill",
      trait: BasicAttribute.Resistance,
      buffPercentage: -50, // reduce resistance by 50%
      durationSeconds: timeout,
      durationType: "temporary",
      options: {
        messages: {
          skipAllMessages: true,
        },
      },
    });
  },
};
