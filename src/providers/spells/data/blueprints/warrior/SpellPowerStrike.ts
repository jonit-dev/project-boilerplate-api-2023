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

export const spellPowerStrike: Partial<ISpell> = {
  key: SpellsBlueprint.PowerStrike,
  name: "Power Strike",
  description: "Temporarily increases the warrior's strength.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "gûl-eglir",
  manaCost: 60,
  minLevelRequired: 4,
  minMagicLevelRequired: 5,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.BlueWings,
  attribute: BasicAttribute.Strength,
  characterClass: [CharacterClass.Warrior],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const spellCalculator = container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 20,
      max: 120,
    });

    const buffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 10,
      max: 35,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
    });
  },
};
