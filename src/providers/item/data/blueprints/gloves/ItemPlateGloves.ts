import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { GlovesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPlateGloves: IEquippableArmorBlueprint = {
  key: GlovesBlueprint.PlateGloves,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/plate-gloves.png",

  name: "Plate Gloves",
  description: "A pair of plated gloves.",
  defense: 10,
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 65,
};
