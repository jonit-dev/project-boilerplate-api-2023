import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { IEntityEffect } from "@providers/entityEffects/data/blueprints/entityEffect";
import { IPosition } from "@providers/movement/MovementHelper";
import { AnimationEffectKeys, EntityType } from "@rpg-engine/shared";

export interface IAffectedTarget {
  target: ICharacter[] | INPC[];
  intensity: number; // spell area grid can have different intensity coefficient on different areas of the grid, e.g., more intense effect on the center
}

export interface ISpellAreaEffect {
  cells: IPosition[]; // cells affected by the spell. Use this for animation effects
  targets: IAffectedTarget[]; // NPCs and Characters reached by the spell
}

export interface ISpellAreaCalculateEffectOptions {
  includeCaster?: boolean;
  excludeEntityTypes: EntityType[];
}

export interface ISpellAreaCastOptions {
  effectAnimationKey: AnimationEffectKeys;
  entityEffect?: IEntityEffect;
  isAttackSpell?: boolean;
  noCastInNonPvPZone?: boolean;
  spellAreaGrid: number[][];
  customFn?: (target: ICharacter | INPC, intensity: number) => Promise<void> | void; // use case is for example for healing targets, instead of killing them
  includeCaster?: boolean;
  excludeEntityTypes?: EntityType[];
}
