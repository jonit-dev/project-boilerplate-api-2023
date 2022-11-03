import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBerserkersHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.BerserkersHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/berserkers-helmet.png",
  name: "Berserkers Helmet",
  description:
    "Berserker Helmet is an enclosed helmet designed to protect the entire head while intimidating enemies on the battlefield.",
  defense: 6,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Head],
  sellPrice: 21,
};
