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

export const spellDivineProtection: Partial<ISpell> = {
  key: SpellsBlueprint.SpellDivineProtection,
  name: "Divine Protection",
  description: "A Shield boosts magic resistance by 30%, duration varies with magic level.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "divinum praesidium",
  manaCost: 40,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  cooldown: 30,
  animationKey: AnimationEffectKeys.MagicShield,
  attribute: BasicAttribute.MagicResistance,
  characterClass: [CharacterClass.Druid, CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);
    const spellCalculator = container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 30,
      max: 180,
    });

    const buffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 10,
      max: 35,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.MagicResistance,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
    });
  },
};
