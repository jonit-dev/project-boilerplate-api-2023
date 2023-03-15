import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCrimsonAegisShield: IEquippableArmorBlueprint = {
  key: ShieldsBlueprint.CrimsonAegisShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/crimson-aegis-shield.png",
  name: "Crimson Aegis Shield",
  description:
    "The Crimson Aegis Shield is a powerful and imposing piece of defensive equipment often used by elite warriors and knights who serve as protectors of the realm",
  weight: 1,
  defense: 24,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
