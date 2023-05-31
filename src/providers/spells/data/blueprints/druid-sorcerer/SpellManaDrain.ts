import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { container } from "@providers/inversify/container";
import {
  AnimationEffectKeys,
  CharacterClass,
  ISpell,
  RangeTypes,
  SpellCastingType,
  SpellsBlueprint,
} from "@rpg-engine/shared";
import { ManaDrain } from "../../logic/mage/ManaDrain";

export const spellManaDrain: Partial<ISpell> = {
  key: SpellsBlueprint.ManaDrain,
  name: "Mana Drain",
  description: "The spell is designed to absorb a % of the character's mana.",
  castingType: SpellCastingType.RangedCasting,
  magicWords: "mana exhauriunt",
  manaCost: 0, // its 0
  minLevelRequired: 20,
  minMagicLevelRequired: 30,
  cooldown: 360,
  maxDistanceGrid: RangeTypes.High,
  castingAnimationKey: AnimationEffectKeys.MagicShield,
  projectileAnimationKey: AnimationEffectKeys.Energy,
  characterClass: [CharacterClass.Sorcerer, CharacterClass.Druid],

  usableEffect: async (character: ICharacter, target: ICharacter) => {
    const manaDrain = container.get(ManaDrain);

    return await manaDrain.handleManaDrain(character, target);
  },
};
