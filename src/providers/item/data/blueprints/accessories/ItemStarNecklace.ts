import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStarNecklace: Partial<IItem> = {
  key: AccessoriesBlueprint.StarNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/star-necklace.png",
  name: "Star Necklace",
  description:
    "A necklace with a pendant in the shape of a star. The pendant may be made of gold, silver, or other materials and may be encrusted with diamonds or other precious stones.",
  attack: 2,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 44,
};
