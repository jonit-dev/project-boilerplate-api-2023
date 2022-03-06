import { MapLayers } from "@rpg-engine/shared";

export interface ITiled {
  compressionlevel: number;
  height: number;
  infinite: boolean;
  layers: ITiledLayer[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: ITileset[];
  tilewidth: number;
  type: string;
  version: string;
  width: number;
}

export interface ITiledLayer {
  chunks: ITiledChunk[];
  height: number;
  id: number;
  name: string;
  opacity: number;
  properties: ILayerProperty[];
  startx: number;
  starty: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export interface ITiledChunk {
  data: number[];
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface ILayerProperty {
  name: string;
  type: string;
  value: string;
}

export interface ITileset {
  columns: number;
  firstgid: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tileheight: number;
  tiles: ITile[];
  tilewidth: number;
  wangsets: IWangset[];
}

export interface ITile {
  id: number;
  properties: ITileProperty[];
  animation?: IAnimation[];
}

export interface IAnimation {
  duration: number;
  tileid: number;
}

export interface ITileProperty {
  name: string;
  type: Type;
  value: boolean;
}

export enum Type {
  Bool = "bool",
}

export interface IWangset {
  colors: IColor[];
  name: string;
  tile: number;
  type: string;
  wangtiles: IWangTile[];
}

export interface IColor {
  color: string;
  name: string;
  probability: number;
  tile: number;
}

export interface IWangTile {
  tileid: number;
  wangid: number[];
}

export interface IGetTileXYResult {
  x: number;
  y: number;
}

export interface ITiledTile {
  id: number;
  properties: ITileProperty[];
}

export const TiledLayerNames = {
  [MapLayers.Ground]: "ground",
  [MapLayers.OverGround]: "over-ground",
  [MapLayers.Player]: "player",
  [MapLayers.OverPlayer]: "over-player",
};
