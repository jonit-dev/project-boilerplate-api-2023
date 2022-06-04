import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType, MapLayers } from "@rpg-engine/shared";
import dayjs from "dayjs";

export const itemGroundBlood: Partial<IItem> = {
  key: "ground-blood",
  type: ItemType.Other,
  subType: ItemSubType.Other,
  decayTime: dayjs(new Date()).add(10, "minute").toDate(),
  layer: MapLayers.Ground + 0.5, // avoid overlap with body
  textureAtlas: "battle-effects",
  texturePath: "red-blood-1.png",
  textureKey: "red-blood",
  name: "Blood",
  description: "You see blood from a living creature.",
  weight: 1,
  isStorable: false,
  isItemContainer: false,
};
