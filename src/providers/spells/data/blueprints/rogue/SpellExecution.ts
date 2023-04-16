import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, RangeTypes, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { BerserkerSpells } from "@providers/spells/data/logic/berserker/BerserkerSpells";

export const rogueSpellExecution: Partial<ISpell> = {
  key: SpellsBlueprint.RogueExecution,
  name: "Suplicium",
  description: "The Execution spell is designed for Rogues to instantly eliminate opponents",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "supplicium furtim",
  manaCost: 100,
  minLevelRequired: 12,
  minMagicLevelRequired: 8,
  animationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.HitCorruption,
  maxDistanceGrid: RangeTypes.Short,
  characterClass: [CharacterClass.Rogue],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    await container.get(BerserkerSpells).handleBerserkerExecution(character, target);
  },
};
