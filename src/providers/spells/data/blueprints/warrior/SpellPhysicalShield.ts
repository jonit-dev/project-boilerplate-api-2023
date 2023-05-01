import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuff } from "@providers/character/characterBuff/CharacterBuff";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellPhysicalShield: Partial<ISpell> = {
  key: SpellsBlueprint.SpellPhysicalShield,
  name: "Self Physical Shield",
  description: "A Self Physical Shield.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas zirh",
  manaCost: 60,
  minLevelRequired: 7,
  minMagicLevelRequired: 7,
  cooldown: 20,
  animationKey: AnimationEffectKeys.PhysicalShield,
  attribute: BasicAttribute.Resistance,
  characterClass: [CharacterClass.Warrior],

  usableEffect: async (character: ICharacter) => {
    const characterBuff = container.get(CharacterBuff);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 5, 20), 180);

    await characterBuff.enableTemporaryBuff(character, {
      type: "skill",
      trait: BasicAttribute.Resistance,
      buffPercentage: 30,
      durationSeconds: timeout,
      durationType: "temporary",
    });
  },
};
