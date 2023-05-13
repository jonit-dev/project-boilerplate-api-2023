import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  SpellCastingType,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellFocus: Partial<ISpell> = {
  key: SpellsBlueprint.Focus,
  name: "Focus",
  description: "A spell that temporarily increases character dexterity, thus, increasing the chance to hit or dodge.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "handalë tenn'amin",
  manaCost: 20,
  minLevelRequired: 3,
  minMagicLevelRequired: 3,
  cooldown: 30,
  animationKey: AnimationEffectKeys.Holy,
  attribute: BasicAttribute.Dexterity,
  characterClass: [CharacterClass.Rogue, CharacterClass.Hunter],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);
    const spellCalculator = container.get(SpellCalculator);
    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      max: 120,
      min: 30,
    });

    const buffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, BasicAttribute.Magic, {
      max: 25,
      min: 10,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Dexterity,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      options: {
        messages: {
          activation: `You feel more focused. (Dexterity +${buffPercentage}%)`,
          deactivation: `You feel less focused. (Dexterity -${buffPercentage}%)`,
        },
      },
    });
  },
};
