import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, RangeTypes, SpellCastingType } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellStunTarget: Partial<ISpell> = {
  key: SpellsBlueprint.WarriorStunTarget,
  name: "Stun",
  description: "A spell designed for a warrior to stun a target in battle.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "talas tamb-eth",
  manaCost: 60,
  minLevelRequired: 4,
  minMagicLevelRequired: 8,
  cooldown: 60,
  animationKey: AnimationEffectKeys.Rooted,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  maxDistanceGrid: RangeTypes.Medium,
  characterClass: [CharacterClass.Warrior],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    if (character._id.toString() === target._id.toString()) {
      return false;
    }

    const spellCalculator = container.get(SpellCalculator);

    const effect = container.get(SpecialEffect);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 10,
      max: 40,
    });

    await effect.stun(target, timeout);

    return true;
  },
};
