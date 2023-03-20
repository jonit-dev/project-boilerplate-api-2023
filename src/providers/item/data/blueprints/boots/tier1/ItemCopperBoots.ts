import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier1Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCopperBoots: IEquippableLightArmorTier1Blueprint = {
  key: BootsBlueprint.CopperBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/copper-boots.png",
  name: "Copper Boots",
  description: "A boots plated with cooper.",
  defense: 5,
  tier: 1,
  weight: 1.25,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 41,
};
