import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellShapeshift: Partial<ISpell> = {
  key: SpellsBlueprint.DruidShapeshift,
  name: "Shapeshift Spell",
  description: "A spell designed to turn a druid into a Bear. Raise Attack and Resistance.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas qabi",
  manaCost: 150,
  minLevelRequired: 10,
  minMagicLevelRequired: 10,
  animationKey: AnimationEffectKeys.ManaHeal,
  characterClass: [CharacterClass.Druid],

  usableEffect: async (character: ICharacter) => {
    const effect = container.get(SpecialEffect);
    const characterSkillBuff = container.get(CharacterSkillBuff);

    const skills = (await Skill.findById(character.skills).lean().select("magic strength resistance")) as ISkill;

    const timeoutInSecs = Math.min(Math.max(skills.magic.level * 1.5, 15), 180);
    const strengthPercent = Math.min(Math.max(skills.strength.level * 0.5, 5), 30);
    const resistancePercent = Math.min(Math.max(skills.resistance.level * 0.5, 5), 30);

    await effect.shapeShift(character, "brown-bear", timeoutInSecs);

    await characterSkillBuff.enableTemporaryBuff(character, BasicAttribute.Strength, strengthPercent, timeoutInSecs);

    await characterSkillBuff.enableTemporaryBuff(
      character,
      BasicAttribute.Resistance,
      resistancePercent,
      timeoutInSecs
    );
  },
};
