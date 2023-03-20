import { IEquippableArmorTier2Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ArmorsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBrassArmor: IEquippableArmorTier2Blueprint = {
  key: ArmorsBlueprint.BrassArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/brass-armor.png",

  name: "Brass Armor",
  description:
    "Brass armor is often used by soldiers and warriors who require a balance of protection and mobility in combat",
  defense: 16,
  tier: 2,
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 110,
};
