import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, EntityType, RangeTypes, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellExecution: Partial<ISpell> = {
  key: SpellsBlueprint.RogueExecution,
  name: "Execution",
  description: "A spell designed for a warrior to stun a target in battle.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "supplicium furtim",
  manaCost: 100,
  minLevelRequired: 15,
  minMagicLevelRequired: 8,
  animationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.HitCorruption,
  maxDistanceGrid: RangeTypes.UltraShort,
  characterClass: [CharacterClass.Rogue],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const effect = container.get(SpecialEffect);

    await effect.execution(character, target._id, target.type as EntityType);
  },
};
