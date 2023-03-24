import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, SpellCastingType, EntityType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";

export const spellWarriorStunTarget: Partial<ISpell> = {
  key: SpellsBlueprint.WarriorStunTarget,
  name: "Stun",
  description: "A spell designed for a warrior to stun a target in battle.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "talas tamb-eth",
  manaCost: 60,
  minLevelRequired: 4,
  minMagicLevelRequired: 3,
  animationKey: AnimationEffectKeys.Rooted,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  maxDistanceGrid: 7,

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const effect = container.get(SpecialEffect);
    const skills = (await Skill.findById(character.skills).lean()) as ISkill;
    const timeout = Math.min(Math.max(skills.magic.level * 5, 10), 180);

    await effect.stun(target._id, target.type as EntityType, timeout);

    return true;
  },
};
