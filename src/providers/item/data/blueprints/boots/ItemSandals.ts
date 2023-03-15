import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSandals: IEquippableArmorBlueprint = {
  key: BootsBlueprint.Sandals,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/sandals.png",
  name: "Sandals",
  description: "A simple sandals.",
  defense: 1,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 29,
};
