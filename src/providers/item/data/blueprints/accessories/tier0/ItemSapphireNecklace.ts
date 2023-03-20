import { IEquippableAccessoryTier0Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSapphireNecklace: IEquippableAccessoryTier0Blueprint = {
  key: AccessoriesBlueprint.SapphireNecklace,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/sapphire-necklace.png",
  name: "Sapphire Necklace",
  description:
    "A necklace featuring a large, beautiful sapphire gemstone. The sapphire is often set in gold or silver and may be surrounded by smaller diamonds.",
  attack: 3,
  defense: 0,
  tier: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Neck],
  basePrice: 57,
};
