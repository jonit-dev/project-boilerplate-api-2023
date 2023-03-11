import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCrownHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.CrownHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/crown-helmet.png",
  name: "Crown Helmet",
  description:
    "A crown helmet is a regal headpiece adorned with intricate gold and jewel designs, fit for a king or queen.",
  weight: 1,
  defense: 22,
};
