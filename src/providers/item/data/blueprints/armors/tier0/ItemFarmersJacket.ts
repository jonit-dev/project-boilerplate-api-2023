import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFarmersJacket: IEquippableArmorTier0Blueprint = {
  key: ArmorsBlueprint.FarmersJacket,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/farmers-jacket.png",
  name: "Farmers Jacket",
  description:
    "Crafted from durable and breathable materials such as cotton or wool, Farmers Jackets are designed to be comfortable and practical for use during physical labor.",
  defense: 4,
  tier: 0,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 0,
};
