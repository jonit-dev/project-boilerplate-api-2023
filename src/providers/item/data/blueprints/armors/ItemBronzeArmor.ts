import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBronzeArmor: Partial<IItem> = {
  key: "bronze-armor",
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/bronze-armor.png",
  textureKey: "armors",
  name: "Bronze Armor",
  description: "A bronze plated armor.",
  defense: 16,
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.Torso],
};
