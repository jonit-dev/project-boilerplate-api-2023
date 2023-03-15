import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { LegsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFalconsLegs: IEquippableArmorBlueprint = {
  key: LegsBlueprint.FalconsLegs,
  type: ItemType.Armor,
  subType: ItemSubType.Legs,
  textureAtlas: "items",
  texturePath: "legs/falcons-legs.png",
  name: "Falcon's Legs",
  description:
    "The legs are often adorned with intricate patterns and designs that evoke the grace and speed of the majestic falcon. ",
  weight: 1,
  defense: 17,
  allowedEquipSlotType: [ItemSlotType.Legs],
};
