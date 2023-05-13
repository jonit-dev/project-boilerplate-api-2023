import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, BasicAttribute, CharacterClass, SpellCastingType } from "@rpg-engine/shared";
import { SpellCalculator } from "../../abstractions/SpellCalculator";
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
  cooldown: 10,
  animationKey: AnimationEffectKeys.ManaHeal,
  characterClass: [CharacterClass.Rogue],

  usableEffect: async (character: ICharacter) => {
    const effect = container.get(SpecialEffect);
    const spellCalculator = container.get(SpellCalculator);
    const timeout = await spellCalculator.calculateTimeoutBasedOnSkillLevel(character, BasicAttribute.Magic, {
      min: 15,
      max: 40,
    });

    return await effect.turnInvisible(character, timeout);
  },
};
