import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, RangeTypes, SpellCastingType } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellEntanglingRoots: Partial<ISpell> = {
  key: SpellsBlueprint.EntanglingRoots,
  name: "Entangling Roots",
  description: "Stun your enemy by manipulating the primal forces of nature",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "raithin-nodrim",
  manaCost: 80,
  minLevelRequired: 4,
  minMagicLevelRequired: 8,
  cooldown: 60,
  castingAnimationKey: AnimationEffectKeys.SkillLevelUp,
  targetHitAnimationKey: AnimationEffectKeys.Rooted,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  maxDistanceGrid: RangeTypes.High,
  characterClass: [CharacterClass.Druid],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    if (character._id.toString() === target._id.toString()) {
      return false;
    }

    const spellCalculator = container.get(SpellCalculator);

    const effect = container.get(SpecialEffect);

    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 10,
      max: 30,
    });

    await effect.stun(target, timeout);

    return true;
  },
};
