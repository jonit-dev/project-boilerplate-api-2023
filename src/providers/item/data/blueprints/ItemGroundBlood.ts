import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemGroundBlood: Partial<IItem> = {
  key: "ground-blood",
  type: ItemType.Other,
  subType: ItemSubType.Other,
  textureAtlas: "battle-effects",
  texturePath: "red-blood-1.png",
  textureKey: "red-blood",
  name: "Blood",
  description: "You see blood from a living creature.",
  weight: 1,
  isStorable: false,
  isItemContainer: false,
};
