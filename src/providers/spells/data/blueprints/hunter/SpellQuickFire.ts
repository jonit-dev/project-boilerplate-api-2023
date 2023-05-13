import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  SpellCastingType,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellQuickFire: Partial<ISpell> = {
  key: SpellsBlueprint.HunterQuickFire,
  name: "QuickFire",
  description: "QuickFire spell unleash a flurry of attacks on their enemies.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "ieiunium iecit",
  manaCost: 150,
  minLevelRequired: 15,
  minMagicLevelRequired: 18,
  cooldown: 20,
  animationKey: AnimationEffectKeys.BlueWings,
  characterClass: [CharacterClass.Hunter],
  attribute: CharacterAttributes.AttackIntervalSpeed,

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);
    const spellCalculator = container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Dexterity, {
      min: 20,
      max: 120,
    });

    const buffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, BasicAttribute.Dexterity, {
      min: 10,
      max: 30,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.AttackIntervalSpeed,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
    });
  },
};
