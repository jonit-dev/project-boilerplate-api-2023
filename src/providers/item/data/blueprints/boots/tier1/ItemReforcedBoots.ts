import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemReforcedBoots: IEquippableLightArmorTier1Blueprint = {
  key: BootsBlueprint.ReforcedBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/reforced-boots.png",
  name: "Reforced Boots",
  description: "A boot made with reinforced leather.",
  defense: 5,
  tier: 1,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 41,
};
