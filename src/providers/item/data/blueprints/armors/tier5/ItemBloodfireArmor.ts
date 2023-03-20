import { IEquippableArmorTier5Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBloodfireArmor: IEquippableArmorTier5Blueprint = {
  key: ArmorsBlueprint.BloodfireArmor,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/bloodfire-armor.png",
  name: "Bloodfire Armor",
  description:
    "This powerful armor is said to be forged from the flames of dragons and imbued with the essence of blood magic, granting its wearer enhanced strength and the ability to wield powerful fire-based attacks.",
  defense: 37,
  tier: 5,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.Torso],
  basePrice: 180,
};
