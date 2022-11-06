import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCopperBoots: Partial<IItem> = {
  key: BootsBlueprint.CopperBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/copper-boots.png",
  name: "Copper Boots",
  description: "A boots plated with cooper.",
  defense: 4,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  sellPrice: 12,
};
