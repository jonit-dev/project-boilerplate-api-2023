import { IEquippableLightArmorTier12Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGaiasSoleplate: IEquippableLightArmorTier12Blueprint = {
  key: BootsBlueprint.GaiasSoleplate,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/gaias-soleplate.png",
  name: "Gaias Soleplate",
  description: "Embodying the earths strength, they ground the wearer with natures power.",
  defense: 68,
  tier: 12,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 135,
};
