import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
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
import { DruidSpells } from "../../logic/berserker/DruidSpells";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellShapeshift: Partial<ISpell> = {
  key: SpellsBlueprint.DruidShapeshift,
  name: "Shapeshift Spell",
  description: "A spell designed to turn a druid into a Bear. Raise Attack and Resistance.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas qabi",
  manaCost: 150,
  minLevelRequired: 10,
  minMagicLevelRequired: 15,
  cooldown: 15,
  animationKey: AnimationEffectKeys.ManaHeal,
  characterClass: [CharacterClass.Druid],

  usableEffect: async (character: ICharacter) => {
    const druidSpells = container.get(DruidSpells);
    const characterBuffActivator = container.get(CharacterBuffActivator);

    const skills = (await Skill.findById(character.skills).lean().select("magic strength resistance")) as ISkill;

    const timeoutInSecs = Math.min(Math.max(skills.magic.level * 1.5, 15), 180);
    const strengthPercent = Math.min(Math.max(skills.strength.level * 0.5, 5), 30);
    const resistancePercent = Math.min(Math.max(skills.resistance.level * 0.5, 5), 30);

    await druidSpells.handleShapeShift(character, "brown-bear", timeoutInSecs);

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Strength,
      buffPercentage: strengthPercent,
      durationSeconds: timeoutInSecs,
      durationType: CharacterBuffDurationType.Temporary,
    });

    await characterBuffActivator.enableTemporaryBuff(character, {
      type: CharacterBuffType.Skill,
      trait: BasicAttribute.Resistance,
      buffPercentage: resistancePercent,
      durationSeconds: timeoutInSecs,
      durationType: CharacterBuffDurationType.Temporary,
    });
  },
};
