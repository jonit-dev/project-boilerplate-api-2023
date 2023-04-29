import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterAttributes, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellSelfHaste: Partial<ISpell> = {
  key: SpellsBlueprint.SelfHasteSpell,
  name: "Self Haste Spell",
  description: "A self haste spell.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas hiz",
  manaCost: 40,
  minLevelRequired: 5,
  minMagicLevelRequired: 5,
  cooldown: 35,
  animationKey: AnimationEffectKeys.HasteSpell,
  attribute: CharacterAttributes.Speed,

  usableEffect: async (character: ICharacter) => {
    const characterSkillBuff = container.get(CharacterSkillBuff);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    const timeout = Math.min(Math.max(skills.magic.level * 8, 0), 120);
    const skillType = CharacterAttributes.Speed;

    await characterSkillBuff.enableTemporaryBuff(character, skillType, 30, timeout);
  },
};
