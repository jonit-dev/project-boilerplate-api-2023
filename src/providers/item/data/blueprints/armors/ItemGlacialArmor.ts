import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGlacialArmor: IEquippableArmorBlueprint = {
  key: ArmorsBlueprint.GlacialArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/glacial-armor.png",
  name: "Glacial Armor",
  description:
    "A legendary armor forged from a rare, incredibly strong metal that is light, durable, and highly sought after.",
  defense: 30,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 160,
};
