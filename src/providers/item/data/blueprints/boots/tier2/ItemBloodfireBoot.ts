import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBloodfireBoot: IEquippableLightArmorTier2Blueprint = {
  key: BootsBlueprint.BloodfireBoot,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/bloodfire-boot.png",
  name: "Bloodfire Boot",
  description:
    "The Bloodfire Boots are often associated with the power and intensity of fire magic, as well as the dark and mysterious nature of blood magic.",
  defense: 8,
  tier: 2,
  weight: 1,
  basePrice: 90,
  allowedEquipSlotType: [ItemSlotType.Feet],
};
