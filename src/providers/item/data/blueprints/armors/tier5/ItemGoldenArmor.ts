import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier5Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldenArmor: IEquippableArmorTier5Blueprint = {
  key: ArmorsBlueprint.GoldenArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/golden-armor.png",
  name: "Golden Armor",
  description: "A Golden Armor is a suit of heavy-duty scale armor made out of gold.",
  defense: 40,
  tier: 5,
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 177,
};
