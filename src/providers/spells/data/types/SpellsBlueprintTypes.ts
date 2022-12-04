import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SpellCastingType } from "@rpg-engine/shared";

export enum SpellsBlueprint {
  SelfHealingSpell = "self-healing-spell",
}

export interface ISpell {
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
