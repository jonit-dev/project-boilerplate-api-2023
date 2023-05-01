import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { CharacterBuff } from "@providers/character/characterBuff/CharacterBuff";
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
    const characterBuff = container.get(CharacterBuff);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;

    const timeout = Math.min(Math.max(skills.magic.level * 8, 0), 120);

    await characterBuff.enableTemporaryBuff(character, {
      type: "characterAttribute",
      trait: CharacterAttributes.Speed,
      buffPercentage: 20,
      durationSeconds: timeout,
      durationType: "temporary",
    });
  },
};
