import { IEquippableAccessoryTier0Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemAmuletOfDeath: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.AmuletOfDeath,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/amulet-of-death.png",
  name: "Amulet Of Death",
  description: "This amulet prevents equipment, items and skill loss on death.",
  attack: 3,
  defense: 3,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 3000,
};
