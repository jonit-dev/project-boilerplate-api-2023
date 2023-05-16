import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { Execution } from "@providers/spells/data/logic/berserker/Execution";
import {
  AnimationEffectKeys,
  CharacterClass,
  ISpell,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";

export const berserkerSpellExecution: Partial<ISpell> = {
  key: SpellsBlueprint.BerserkerExecution,
  name: "Insania Supplicium",
  description: "The Execution spell is designed to instantly eliminate opponents if target's health is <= 30%",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "insania supplicium",
  manaCost: 150,
  minLevelRequired: 20,
  minMagicLevelRequired: 16,
  cooldown: 150,
  castingAnimationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.HitCorruption,
  maxDistanceGrid: RangeTypes.UltraShort,
  characterClass: [CharacterClass.Berserker],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    await container.get(Execution).handleBerserkerExecution(character, target);
  },
};
