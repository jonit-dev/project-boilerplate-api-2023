import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterSkillBuff } from "@providers/character/CharacterBuffer/CharacterSkillBuff";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, CharacterEntities, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellQuickFire: Partial<ISpell> = {
  key: SpellsBlueprint.HunterQuickFire,
  name: "QuickFire",
  description: "QuickFire spell unleash a flurry of attacks on their enemies.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "ieiunium iecit",
  manaCost: 150,
  minLevelRequired: 15,
  minMagicLevelRequired: 10,
  animationKey: AnimationEffectKeys.BlueWings,
  characterClass: [CharacterClass.Hunter],
  attribute: CharacterEntities.AttackIntervalSpeed,

  usableEffect: async (character: ICharacter) => {
    const characterSkillBuff = container.get(CharacterSkillBuff);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    const timeout = Math.min(Math.max(skills.dexterity.level * 8, 20), 120);
    const skillType = CharacterEntities.AttackIntervalSpeed;

    await characterSkillBuff.enableTemporaryBuff(character, skillType, 90, timeout);
  },
};
