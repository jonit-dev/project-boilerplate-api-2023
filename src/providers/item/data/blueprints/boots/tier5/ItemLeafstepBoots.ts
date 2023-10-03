import { IEquippableLightArmorTier5Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemLeafstepBoots: IEquippableLightArmorTier5Blueprint = {
  key: BootsBlueprint.LeafstepBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/leafstep-boots.png",
  name: "Leafstep Boots",
  description: "Treading softly, these boots whisper secrets of the forest,",
  defense: 25,
  tier: 5,
  weight: 0.4,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 98,
};
