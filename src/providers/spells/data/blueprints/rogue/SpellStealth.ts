import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  BasicAttribute,
  CharacterClass,
  ISpell,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";

export const spellStealth: Partial<ISpell> = {
  key: SpellsBlueprint.RogueStealth,
  name: "Stealth Spell",
  description: "A spell designed to turn a rogue invisible.",
  castingType: SpellCastingType.SelfCasting,
  magicWords: "talas nelluon",
  manaCost: 80,
  minLevelRequired: 10,
  minMagicLevelRequired: 8,
  cooldown: 120,
  castingAnimationKey: AnimationEffectKeys.ManaHeal,
  characterClass: [CharacterClass.Rogue],

  usableEffect: async (character: ICharacter) => {
    const effect = container.get(SpecialEffect);
    const spellCalculator = container.get(SpellCalculator);
    const timeout = await spellCalculator.calculateBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 20,
      max: 45,
    });

    return await effect.turnInvisible(character, timeout);
  },
};
