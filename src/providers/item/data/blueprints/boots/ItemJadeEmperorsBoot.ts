import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemJadeEmperorsBoot: IEquippableArmorBlueprint = {
  key: BootsBlueprint.JadeEmperorsBoot,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/jade-emperors-boot.png",
  name: "Jade Emperor's Boot",
  description:
    "The Jade Emperor's Boots are often associated with the majesty and power of Eastern mythology, as well as the agility and speed of characters who prioritize these traits in combat.",
  defense: 6,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 80,
};
