import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuff } from "@providers/character/characterBuff/CharacterBuff";
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
    const characterBuff = container.get(CharacterBuff);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 5, 20), 180);

    await characterBuff.enableTemporaryBuff(character, {
      type: "skill",
      trait: CombatSkill.Shielding,
      buffPercentage: 30,
      durationSeconds: timeout,
      durationType: "temporary",
    });
  },
};
