import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuffActivator } from "@providers/character/characterBuff/CharacterBuffActivator";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  CharacterAttributes,
  CharacterBuffDurationType,
  CharacterBuffType,
  CharacterClass,
  SpellCastingType,
} from "@rpg-engine/shared";
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
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    const timeout = Math.min(Math.max(skills.dexterity.level * 8, 20), 120);

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.CharacterAttribute,
      trait: CharacterAttributes.AttackIntervalSpeed,
      buffPercentage: 35,
      durationSeconds: timeout,
      durationType: CharacterBuffDurationType.Temporary,
    });
  },
};
