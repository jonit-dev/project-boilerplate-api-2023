import { IItem } from "@entities/ModuleInventory/ItemModel";
import { MapHelper } from "@providers/map/MapHelper";
import { MapLoader } from "@providers/map/MapLoader";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "./data/index";

//! Main goal of a loader is to merge Tiled data with our blueprints data.

export interface IItemSeedData extends Omit<IItem, "_id"> {
  tiledId: number;
}
@provide(ItemLoader)
export class ItemLoader {
  constructor(private mapHelper: MapHelper) {}

  public loadItemSeedData(): Map<string, IItemSeedData> {
    const itemSeedData = new Map<string, IItemSeedData>();

    for (const [mapName, items] of MapLoader.tiledItems.entries()) {
      for (const tiledItemData of items) {
        const sceneName = this.mapHelper.getSceneNameFromMapName(mapName);

        if (!sceneName) {
          throw new Error(`ItemLoader: Scene name is not found for map ${mapName}`);
        }

        const { key, data } = this.mapHelper.mergeBlueprintWithTiledProps<IItemSeedData>(
          tiledItemData,
          mapName,
          itemsBlueprintIndex,
          null
        );

        itemSeedData.set(key, data);
      }
    }

    return itemSeedData;
  }
}
