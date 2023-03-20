import { IEquippableAccessoryTier0Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRoyalBracelet: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.RoyalBracelet,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/royal-bracelet.png",
  name: "Royal Bracelet",
  description:
    "An ornate bracelet, often made of gold or other precious materials, that is traditionally worn by royalty.",
  attack: 1,
  defense: 0,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 42,
};
