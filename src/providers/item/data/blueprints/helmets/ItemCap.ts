import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCap: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.Cap,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/cap.png",
  name: "Cap",
  description: "Simple cap.",
  defense: 2,
  weight: 0.3,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 0,
};
