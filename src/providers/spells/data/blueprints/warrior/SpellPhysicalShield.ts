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

export const spellPhysicalShield: Partial<ISpell> = {
  key: SpellsBlueprint.SpellPhysicalShield,
  name: "Self Physical Shield",
  description: "A physical shield that boosts physical resistance by 30%, duration varies with magic level.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas zirh",
  manaCost: 60,
  minLevelRequired: 7,
  minMagicLevelRequired: 7,
  cooldown: 40,
  castingAnimationKey: AnimationEffectKeys.PhysicalShield,
  attribute: BasicAttribute.Resistance,
  characterClass: [CharacterClass.Warrior],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);
    const spellCalculator = container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 30,
      max: 120,
    });

    const buffPercentage = await spellCalculator.calculateBuffBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 10,
      max: 35,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
    });
  },
};
