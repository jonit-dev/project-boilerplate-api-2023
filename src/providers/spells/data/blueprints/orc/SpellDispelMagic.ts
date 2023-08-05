import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  ISpell,
  ShadowWalkerRaces,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellDispelMagic: Partial<ISpell> = {
  key: SpellsBlueprint.OrcDispelMagic,
  name: "Dispel Magic",
  description: "Temporarily increases orc's magic resistance skill.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "fell strike",
  manaCost: 25,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  cooldown: 160,
  castingAnimationKey: AnimationEffectKeys.MagicShield,
  attribute: BasicAttribute.MagicResistance,
  characterRace: [ShadowWalkerRaces.Orc],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const spellCalculator = container.get(SpellCalculator);

    const [timeout, buffPercentage] = await Promise.all([
      spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.MagicResistance, {
        min: 15,
        max: 100,
      }),
      spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.MagicResistance, {
        min: 5,
        max: 40,
      }),
    ]);

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.MagicResistance,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      isStackable: false,
      originateFrom: SpellsBlueprint.OrcDispelMagic,
    });
  },
};
