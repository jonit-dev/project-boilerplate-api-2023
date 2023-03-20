import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBronzeArmor: IEquippableArmorTier2Blueprint = {
  key: ArmorsBlueprint.BronzeArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/bronze-armor.png",
  name: "Bronze Armor",
  description: "A bronze plated armor.",
  defense: 18,
  tier: 2,
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 97,
};
