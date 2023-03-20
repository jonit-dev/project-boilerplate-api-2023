import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCap: IEquippableLightArmorTier0Blueprint = {
  key: HelmetsBlueprint.Cap,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/cap.png",
  name: "Cap",
  description: "Simple cap.",
  defense: 2,
  tier: 0,
  weight: 0.3,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 0,
};
