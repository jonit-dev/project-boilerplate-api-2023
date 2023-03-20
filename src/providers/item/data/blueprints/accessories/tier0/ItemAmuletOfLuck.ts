import { IEquippableAccessoryTier0Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { AccessoriesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemAmuletOfLuck: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.AmuletOfLuck,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/amulet-of-luck.png",
  name: "Amulet Of Luck",
  description:
    "Wearing this amulet is said to increase the wearer's chances of success in all their endeavors, from combat to crafting and beyond",
  attack: 0,
  defense: 0,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 5000,
};
