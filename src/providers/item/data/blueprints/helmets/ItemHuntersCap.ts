import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHuntersCap: Partial<IItem> = {
  key: HelmetsBlueprint.HuntersCap,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/hunters-cap.png",
  name: "Hunters Cap",
  description:
    "The Hunter's Cap is a lightweight and durable headpiece that is perfect for those who roam the wilderness in search of prey. ",
  weight: 1,
  defense: 4,
};
