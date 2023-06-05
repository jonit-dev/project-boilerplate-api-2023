import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableArmorTier5Blueprint } from "../../../types/TierBlueprintTypes";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMithrilArmor: IEquippableArmorTier5Blueprint = {
  key: ArmorsBlueprint.MithrilArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/mithril-armor.png",
  name: "Mithril armor",
  description:
    "A legendary armor forged from a rare, incredibly strong metal that is light, durable, and highly sought after.",
  defense: 37,
  tier: 5,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 160,
};
