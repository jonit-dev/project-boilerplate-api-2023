import { IEquippableItemBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemAmazonsNecklace: IEquippableItemBlueprint = {
  key: AccessoriesBlueprint.AmazonsNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/amazons-necklace.png",
  name: "Amazons Necklace",
  description:
    "A necklace made from materials used by the ancient Amazon warriors of Greek mythology. It is said to grant strength and power to the wearer.",
  attack: 1,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 45,
};
