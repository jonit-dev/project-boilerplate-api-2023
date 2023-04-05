import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellStealth: Partial<ISpell> = {
  key: SpellsBlueprint.RogueStealth,
  name: "Stealth Spell",
  description: "A spell designed to turn a rogue invisible.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas nelluon",
  manaCost: 40,
  minLevelRequired: 4,
  minMagicLevelRequired: 3,
  animationKey: AnimationEffectKeys.ManaHeal,
  characterClass: [CharacterClass.Rogue],

  usableEffect: async (character: ICharacter) => {
    const effect = container.get(SpecialEffect);

    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 1.5, 10), 180);

    return await effect.turnInvisible(character, timeout);
  },
};
