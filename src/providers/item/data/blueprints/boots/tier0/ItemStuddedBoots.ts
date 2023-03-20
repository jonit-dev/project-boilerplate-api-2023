import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStuddedBoots: IEquippableLightArmorTier0Blueprint = {
  key: BootsBlueprint.StuddedBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/studded-boots.png",
  name: "Studded Boots",
  description: "A boot made with leather and metal studs.",
  defense: 4,
  tier: 0,
  weight: 0.7,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 37,
};
