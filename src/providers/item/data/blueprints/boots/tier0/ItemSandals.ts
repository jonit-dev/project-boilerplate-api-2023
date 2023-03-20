import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { BootsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSandals: IEquippableLightArmorTier0Blueprint = {
  key: BootsBlueprint.Sandals,
  type: ItemType.Armor,
  subType: ItemSubType.Boot,
  textureAtlas: "items",
  texturePath: "boots/sandals.png",
  name: "Sandals",
  description: "A simple sandals.",
  defense: 1,
  tier: 0,
  weight: 0.2,
  allowedEquipSlotType: [ItemSlotType.Feet],
  basePrice: 29,
};
