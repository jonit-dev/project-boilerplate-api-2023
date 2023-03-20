import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemPlateBoots: IEquippableLightArmorTier2Blueprint = {
  key: BootsBlueprint.PlateBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/plate-boots.png",
  name: "Plate Boots",
  description: "A boot made with metal plates. These, too, are part of  plate armor.",
  defense: 10,
  tier: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 61,
};
