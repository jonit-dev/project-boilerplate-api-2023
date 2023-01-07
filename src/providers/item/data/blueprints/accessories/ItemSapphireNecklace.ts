import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSapphireNecklace: Partial<IItem> = {
  key: AccessoriesBlueprint.SapphireNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/sapphire-necklace.png",
  name: "Sapphire Necklace",
  description:
    "A necklace featuring a large, beautiful sapphire gemstone. The sapphire is often set in gold or silver and may be surrounded by smaller diamonds.",
  attack: 3,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 57,
};
