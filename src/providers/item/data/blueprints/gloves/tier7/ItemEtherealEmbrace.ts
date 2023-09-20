import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier7Blueprint } from "../../../types/TierBlueprintTypes";
import { GlovesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEtherealEmbrace: IEquippableLightArmorTier7Blueprint = {
  key: GlovesBlueprint.EtherealEmbrace,
  type: ItemType.Armor,
  subType: ItemSubType.Glove,
  textureAtlas: "items",
  texturePath: "gloves/ethereal-embrace.png",
  name: "Ethereal Embrace",
  description: "Almost translucent, these gloves seem to be crafted from dreams and cloud wisps.",
  defense: 40,
  tier: 7,
  weight: 1.3,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 103,
};
