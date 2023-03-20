import { IEquippableAccessoryTier2Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRubyRing: IEquippableAccessoryTier2Blueprint = {
  key: AccessoriesBlueprint.RubyRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/ruby-ring.png",
  name: "Ruby Ring",
  description:
    "A stunning and elegant ring adorned with a sparkling ruby, a deep red gemstone known for its beauty and value. It is a symbol of love and passion.",
  attack: 6,
  defense: 7,
  tier: 2,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 45,
};
