import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
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
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellFocus: Partial<ISpell> = {
  key: SpellsBlueprint.Focus,
  name: "Focus",
  description: "A spell that temporarily increases character dexterity, thus, increasing the chance to hit or dodge.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "handalë tenn'amin",
  manaCost: 20,
  minLevelRequired: 4,
  minMagicLevelRequired: 4,
  cooldown: 30,
  castingAnimationKey: AnimationEffectKeys.Holy,
  attribute: BasicAttribute.Dexterity,
  characterClass: [CharacterClass.Rogue, CharacterClass.Hunter],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);
    const spellCalculator = container.get(SpellCalculator);
    const timeout = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      max: 120,
      min: 30,
    });

    const buffPercentage = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
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
      isStackable: false,
      originateFrom: SpellsBlueprint.Focus,
    });
  },
};
