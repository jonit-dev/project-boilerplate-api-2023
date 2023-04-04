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
  description:
    "The amulet is made from a dark and mysterious material, its surface covered in intricate and ominous engravings that seem to pulse with a malevolent energy. It is said that those who wear the Amulet of Death are granted heightened abilities and supernatural powers, but at a terrible cost.",
  attack: 0,
  defense: 0,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 10000,
};
