import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStuddedBoots: IEquippableArmorBlueprint = {
  key: BootsBlueprint.StuddedBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/studded-boots.png",
  name: "Studded Boots",
  description: "A boot made with leather and metal studs.",
  defense: 3,
  weight: 0.7,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 37,
};
