import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemReforcedBoots: IEquippableArmorBlueprint = {
  key: BootsBlueprint.ReforcedBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/reforced-boots.png",
  name: "Reforced Boots",
  description: "A boot made with reinforced leather.",
  defense: 4,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 41,
};
