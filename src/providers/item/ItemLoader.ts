import { IItem } from "@entities/ModuleInventory/ItemModel";
import { MapHelper } from "@providers/map/MapHelper";
import { MapLoader } from "@providers/map/MapLoader";
import { MapObjectsLoader } from "@providers/map/MapObjectsLoader";
import { provide } from "inversify-binding-decorators";
import { itemsBlueprintIndex } from "./data/index";

//! Main goal of a loader is to merge Tiled data with our blueprints data.

export interface IItemSeedData extends Omit<IItem, "_id"> {
  tiledId: number;
}
@provide(ItemLoader)
export class ItemLoader {
  constructor(private mapHelper: MapHelper, private mapObjectsLoader: MapObjectsLoader) {}

  public loadItemSeedData(): Map<string, IItemSeedData> {
    const itemSeedData = new Map<string, IItemSeedData>();

    for (const [mapName, mapData] of MapLoader.maps.entries()) {
      const items = this.mapObjectsLoader.getObjectLayerData("Items", mapData);

      if (!items) {
        continue;
      }

      const itemKeys = getItemKeys(items);
      const uniqueArrayKeys = Array.from(new Set(itemKeys));
      checkIfItemBlueprintsExists(uniqueArrayKeys, mapName);

      for (const tiledItemData of items) {
        if (!mapName) {
          throw new Error(`ItemLoader: Map name is not found for ${mapName}`);
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

function getItemKeys(items: any[]): string[] {
  return items.map((item) => {
    const name = item.name;
    const key = name.toLowerCase().replace(" ", "-");
    return key;
  });
}

function checkIfItemBlueprintsExists(items: string[], mapName: string): void {
  const missingNPCs = items.filter((npc) => !itemsBlueprintIndex[npc]);
  if (missingNPCs.length > 0) {
    throw new Error(
      `❌ ItemLoader: Missing Item blueprints for keys ${missingNPCs.join(
        ", "
      )}. Please, double check the map ${mapName}`
    );
  }
}
