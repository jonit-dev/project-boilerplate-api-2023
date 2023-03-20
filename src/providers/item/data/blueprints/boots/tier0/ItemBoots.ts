import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBoots: IEquippableLightArmorTier0Blueprint = {
  key: BootsBlueprint.Boots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/boots.png",
  name: "Boots",
  description: "A simple leather boots.",
  defense: 2,
  tier: 0,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 0,
};
