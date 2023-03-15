import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBrassArmor: IEquippableArmorBlueprint = {
  key: ArmorsBlueprint.BrassArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/brass-armor.png",

  name: "Brass Armor",
  description:
    "Brass armor is often used by soldiers and warriors who require a balance of protection and mobility in combat",
  defense: 16,
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 110,
};
