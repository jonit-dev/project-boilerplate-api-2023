import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellMagicShield: Partial<ISpell> = {
  key: SpellsBlueprint.SpellMagicShield,
  name: "Self Magic Shield",
  description: "A Self Magic Shield.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas kalkan",
  manaCost: 60,
  minLevelRequired: 8,
  minMagicLevelRequired: 8,
  animationKey: AnimationEffectKeys.MagicShield,
  attribute: BasicAttribute.MagicResistance,
  characterClass: [CharacterClass.Druid, CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter) => {
    const characterSkillBuff = container.get(CharacterSkillBuff);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 5, 10), 180);

    await characterSkillBuff.enableTemporaryBuff(character, BasicAttribute.MagicResistance, 30, timeout);
  },
};
