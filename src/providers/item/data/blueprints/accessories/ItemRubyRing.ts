import { IEquippableItemBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRubyRing: IEquippableItemBlueprint = {
  key: AccessoriesBlueprint.RubyRing,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "rings/ruby-ring.png",
  name: "Ruby Ring",
  description:
    "A stunning and elegant ring adorned with a sparkling ruby, a deep red gemstone known for its beauty and value. It is a symbol of love and passion.",
  attack: 5,
  defense: 3,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 45,
};
