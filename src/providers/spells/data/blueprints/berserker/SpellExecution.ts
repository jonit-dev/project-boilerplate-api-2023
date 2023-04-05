import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, EntityType, RangeTypes, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const berserkerSpellExecution: Partial<ISpell> = {
  key: SpellsBlueprint.BerserkerExecution,
  name: "Insania",
  description: "The Execution spell is designed for Berserkers to instantly eliminate opponents",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "insania supplicium",
  manaCost: 150,
  minLevelRequired: 20,
  minMagicLevelRequired: 8,
  animationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.HitCorruption,
  maxDistanceGrid: RangeTypes.UltraShort,
  characterClass: [CharacterClass.Berserker],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    const effect = container.get(SpecialEffect);

    await effect.execution(character, target._id, target.type as EntityType);
  },
};
