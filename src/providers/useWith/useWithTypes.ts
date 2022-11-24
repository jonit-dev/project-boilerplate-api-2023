import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { MapLayers } from "@rpg-engine/shared";

export interface IUseWithTileEffect {
  (item: IItem, targetTile: IUseWithTargetTile, character: ICharacter): Promise<void> | void;
}

export interface IUseWithItemEffect {
  (targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void> | void;
}

export interface IItemUseWith extends IItem {
  useWithMaxDistanceGrid: number;
  useWithItemEffect?: IUseWithItemEffect;
  useWithTileEffect?: IUseWithTileEffect;
}

export interface IValidUseWithResponse {
  originItem: IItem;
  targetItem?: IItem;
  useWithItemEffect?: IUseWithItemEffect;
  useWithTileEffect?: IUseWithTileEffect;
}

export interface IMagicItemUseWithEntity extends IItem {
  useWithMaxDistanceGrid: number;
  power: number;
  animationKey: string;
  projectileAnimationKey: string;
  minMagicLevelRequired: number;
}

export interface IUseWithTargetTile {
  x: number;
  y: number;
  map: string;
  layer: MapLayers;
}

export interface IUseWithCraftingRecipeItem {
  key: string;
  qty: number;
}

export interface IUseWithCraftingRecipe {
  outputKey: string;
  outputQtyRange: [number, number];
  requiredItems: IUseWithCraftingRecipeItem[];
  difficulty: number; // base % chance of success
}
