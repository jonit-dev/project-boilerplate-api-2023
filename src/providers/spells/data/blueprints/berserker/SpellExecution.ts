import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, RangeTypes, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { BerserkerSpells } from "@providers/spells/data/logic/berserker/BerserkerSpells";

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
    await container.get(BerserkerSpells).handleBerserkerExecution(character, target);
  },
};
