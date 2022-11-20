import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { MapLayers } from "@rpg-engine/shared";

export interface IUseWithTileEffect {
  (item: IItem, targetTile: IUseWithTargetTile, character: ICharacter): Promise<void> | void;
}

export interface IUseWithItemEffect {
  (targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void> | void;
}

export interface IItemUseWithEntity extends IItem {
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
