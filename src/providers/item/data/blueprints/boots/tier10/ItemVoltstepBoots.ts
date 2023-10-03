import { IEquippableLightArmorTier10Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemVoltstepBoots: IEquippableLightArmorTier10Blueprint = {
  key: BootsBlueprint.VoltstepBoots,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/voltstep-boots.png",
  name: "Voltstep Boots",
  description: "Charged with electric might, every step buzzes with energy.",
  defense: 55,
  tier: 10,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 124,
};
