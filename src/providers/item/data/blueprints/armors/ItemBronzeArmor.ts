import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBronzeArmor: Partial<IItem> = {
  key: ArmorsBlueprint.BronzeArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/bronze-armor.png",
  name: "Bronze Armor",
  description: "A bronze plated armor.",
  defense: 18,
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
