interface IMapMetadataTileset {
  name: string;
  imagePath: string;
}

export interface IMapMetaData {
  hash: string;
  layers: string[];
  tileWidth: number;
  tileHeight: number;
  tilesets: IMapMetadataTileset[];
}
