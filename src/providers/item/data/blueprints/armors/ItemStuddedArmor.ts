import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStuddedArmor: Partial<IItem> = {
  key: ArmorsBlueprint.StuddedArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/studded-armor.png",

  name: "Studded Armor",
  description: "A basic leather armor with metal studs.",
  defense: 12,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 73,
};
