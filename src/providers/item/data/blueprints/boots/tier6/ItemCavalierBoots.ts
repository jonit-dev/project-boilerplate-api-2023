import { IEquippableLightArmorTier6Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCavalierBoots: IEquippableLightArmorTier6Blueprint = {
  key: BootsBlueprint.CavalierBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/cavalier-boots.png",
  name: "Cavalier Boots",
  description: "Elegantly designed, these boots are a mark of a true horsemans valor.",
  defense: 30,
  tier: 6,
  weight: 0.8,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 98,
};
