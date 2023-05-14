import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { BerserkerSpells } from "@providers/spells/data/logic/berserker/BerserkerSpells";
import { AnimationEffectKeys, CharacterClass, RangeTypes, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const rogueSpellExecution: Partial<ISpell> = {
  key: SpellsBlueprint.RogueExecution,
  name: "Suplicium Furtim",
  description: "The Execution spell is designed to instantly eliminate opponents if target's health is <= 30%",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "supplicium furtim",
  manaCost: 100,
  minLevelRequired: 12,
  minMagicLevelRequired: 11,
  cooldown: 150,
  castingAnimationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.HitCorruption,
  maxDistanceGrid: RangeTypes.Short,
  characterClass: [CharacterClass.Rogue],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    await container.get(BerserkerSpells).handleBerserkerExecution(character, target);
  },
};
