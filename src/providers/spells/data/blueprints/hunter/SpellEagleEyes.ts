import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuff } from "@providers/character/characterBuff/CharacterBuff";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, CombatSkill, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellEagleEyes: Partial<ISpell> = {
  key: SpellsBlueprint.SpellEagleEyes,
  name: "Eagle Eyes",
  description: "A Self Eagle's Eye.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "kartal leri",
  manaCost: 60,
  minLevelRequired: 8,
  minMagicLevelRequired: 8,
  cooldown: 10,
  animationKey: AnimationEffectKeys.ManaHeal,
  attribute: CombatSkill.Distance,
  characterClass: [CharacterClass.Hunter],

  usableEffect: async (character: ICharacter) => {
    const characterBuff = container.get(CharacterBuff);

    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.distance.level * 5, 10), 180);

    await characterBuff.enableTemporaryBuff(character, {
      type: "skill",
      trait: CombatSkill.Distance,
      buffPercentage: 20,
      durationSeconds: timeout,
      durationType: "temporary",
    });
  },
};
