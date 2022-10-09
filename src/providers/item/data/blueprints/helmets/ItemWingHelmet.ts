import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWingHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.WingHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/wing-helmet.png",
  textureKey: "wing-helmet",
  name: "Wing Helmet",
  description:
    "You see a wing helmet. It's decorated with wings and ancient depictions of the god Hermes, Mercury and of Roma.",
  defense: 5,
  weight: 12,
  allowedEquipSlotType: [ItemSlotType.Head],
};
