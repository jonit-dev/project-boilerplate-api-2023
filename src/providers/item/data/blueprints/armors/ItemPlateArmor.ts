import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPlateArmor: Partial<IItem> = {
  key: ArmorsBlueprint.PlateArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/plate-armor.png",
  textureKey: "plate-armor",
  name: "Plate Armor",
  description:
    "A Plate Armor consists of shaped, interlocking metal plates to cover the entire body and articulated to allow mobility.",
  defense: 13,
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
