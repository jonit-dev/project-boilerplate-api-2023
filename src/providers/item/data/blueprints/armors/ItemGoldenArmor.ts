import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGoldenArmor: Partial<IItem> = {
  key: ArmorsBlueprint.GoldenArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/golden-armor.png",
  name: "Golden Armor",
  description: "A Golden Armor is a suit of heavy-duty scale armor made out of gold.",
  defense: 38,
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 177,
};
