import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCoat: IEquippableArmorBlueprint = {
  key: ArmorsBlueprint.Coat,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/coat.png",

  name: "Coat",
  description: "A heavy pelt coat to warm you.",
  defense: 3,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 37,
};
