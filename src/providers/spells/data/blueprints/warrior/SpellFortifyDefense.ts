import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  CombatSkill,
  ISpell,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellFortifyDefense: Partial<ISpell> = {
  key: SpellsBlueprint.FortifyDefense,
  name: "Self Fortify Defense",
  description: "Temporarily increases the warrior's shielding skill.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "thura korima",
  manaCost: 40,
  minLevelRequired: 6,
  minMagicLevelRequired: 5,
  cooldown: 40,
  castingAnimationKey: AnimationEffectKeys.PhysicalShield,
  attribute: CombatSkill.Shielding,
  characterClass: [CharacterClass.Warrior],

  usableEffect: async (character: ICharacter) => {
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const spellCalculator = container.get(SpellCalculator);

    const timeout = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 20,
      max: 180,
    });

    const buffPercentage = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 20,
      max: 100,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: CombatSkill.Shielding,
      buffPercentage,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
      isStackable: false,
      originateFrom: SpellsBlueprint.FortifyDefense,
    });
  },
};
