import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier5Blueprint } from "../../../types/TierBlueprintTypes";
import { ShieldsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCrimsonAegisShield: IEquippableArmorTier5Blueprint = {
  key: ShieldsBlueprint.CrimsonAegisShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/crimson-aegis-shield.png",
  name: "Crimson Aegis Shield",
  description:
    "The Crimson Aegis Shield is a powerful and imposing piece of defensive equipment often used by elite warriors and knights who serve as protectors of the realm",
  weight: 1,
  defense: 40,
  tier: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
