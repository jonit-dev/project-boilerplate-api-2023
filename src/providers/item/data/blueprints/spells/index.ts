import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SpellCastingType } from "@rpg-engine/shared";
import { SpellsBlueprint } from "../../types/itemsBlueprintTypes";
import { itemSelfHealing } from "./ItemSelfHealing";

export interface IItemSpell {
  key: SpellsBlueprint;
  name: string;
  description: string;
  castingType: SpellCastingType;
  magicWords: string;
  manaCost: number;
  animationKey: string;
  projectileAnimationKey: string;
  minLevelRequired: number;
  minMagicLevelRequired: number;
  usableEffect: (character: ICharacter) => void;
}

export const spellsBlueprintsIndex = {
  [SpellsBlueprint.SelfHealingSpell]: itemSelfHealing,
};
