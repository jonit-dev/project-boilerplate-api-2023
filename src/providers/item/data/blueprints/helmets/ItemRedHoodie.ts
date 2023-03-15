import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRedHoodie: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.RedHoodie,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/red-hoodie.png",
  name: "Red Hoodie",
  description: "A simple red hoodie made with cotton. Very useful to hide your identity.",
  defense: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 33,
};
