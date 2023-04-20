import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, CombatSkill, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellFortifyDefense: Partial<ISpell> = {
  key: SpellsBlueprint.SpellFortifyDefense,
  name: "Self Fortify Defense",
  description: "Temporarily increases the warrior's shielding skill.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "thura korima",
  manaCost: 50,
  minLevelRequired: 6,
  minMagicLevelRequired: 5,
  cooldown: 20,
  animationKey: AnimationEffectKeys.PhysicalShield,
  attribute: CombatSkill.Shielding,
  characterClass: [CharacterClass.Warrior],

  usableEffect: async (character: ICharacter) => {
    const characterSkillBuff = container.get(CharacterSkillBuff);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 5, 20), 180);

    await characterSkillBuff.enableTemporaryBuff(character, CombatSkill.Shielding, 30, timeout);
  },
};
