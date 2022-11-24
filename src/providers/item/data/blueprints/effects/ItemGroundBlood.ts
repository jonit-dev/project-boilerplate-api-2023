import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType, MapLayers } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { EffectsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGroundBlood: Partial<IItem> = {
  key: EffectsBlueprint.GroundBlood,
  type: ItemType.Other,
  subType: ItemSubType.Other,
  decayTime: dayjs(new Date()).add(10, "minute").toDate(),
  layer: MapLayers.Ground + 0.5, // avoid overlap with body
  textureAtlas: "effects",
  texturePath: "blood-floor/red-blood-1.png",

  name: "Blood",
  description: "You see blood from a living creature.",
  weight: 1,
  isStorable: false,
  isItemContainer: false,
};
