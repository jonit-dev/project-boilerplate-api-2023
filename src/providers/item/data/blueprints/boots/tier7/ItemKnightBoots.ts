import { IEquippableLightArmorTier7Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemKnightBoots: IEquippableLightArmorTier7Blueprint = {
  key: BootsBlueprint.KnightBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/knight-boots.png",
  name: "Knight Boots",
  description: "Solid and true, they shield the feet with the honor of a warrior.",
  defense: 36,
  tier: 7,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 105,
};
