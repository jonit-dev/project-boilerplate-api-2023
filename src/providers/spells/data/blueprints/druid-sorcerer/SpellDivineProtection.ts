import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuff } from "@providers/character/characterBuff/CharacterBuff";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellDivineProtection: Partial<ISpell> = {
  key: SpellsBlueprint.SpellDivineProtection,
  name: "Divine Protection",
  description: "A Shield boosts magic resistance by 30%, duration varies with magic level.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "divinum praesidium",
  manaCost: 40,
  minLevelRequired: 5,
  minMagicLevelRequired: 8,
  cooldown: 30,
  animationKey: AnimationEffectKeys.MagicShield,
  attribute: BasicAttribute.MagicResistance,
  characterClass: [CharacterClass.Druid, CharacterClass.Sorcerer],

  usableEffect: async (character: ICharacter) => {
    const characterBuff = container.get(CharacterBuff);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 5, 30), 180);

    await characterBuff.enableTemporaryBuff(character, {
      type: "skill",
      trait: BasicAttribute.MagicResistance,
      buffPercentage: 30,
      durationSeconds: timeout,
      durationType: "temporary",
    });
  },
};
