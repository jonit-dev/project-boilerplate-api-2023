import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { container } from "@providers/inversify/container";
import { AnimationEffectKeys, CharacterClass, RangeTypes, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";
import { BerserkerSpells } from "@providers/spells/data/logic/berserker/BerserkerSpells";

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
  animationKey: AnimationEffectKeys.HitCorruption,
  projectileAnimationKey: AnimationEffectKeys.HitCorruption,
  maxDistanceGrid: RangeTypes.UltraShort,
  characterClass: [CharacterClass.Berserker],

  usableEffect: async (character: ICharacter, target: ICharacter | INPC) => {
    await container.get(BerserkerSpells).handleBerserkerExecution(character, target);
  },
};
