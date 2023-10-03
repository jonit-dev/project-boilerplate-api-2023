import { IEquippableLightArmorTier9Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWindstriderBoots: IEquippableLightArmorTier9Blueprint = {
  key: BootsBlueprint.WindstriderBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/windstrider-boots.png",
  name: "Windstrider Boots",
  description: "Harnessing the gales, these boots grant speed like the sweeping winds.",
  defense: 48,
  tier: 9,
  weight: 0.4,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 118,
};
