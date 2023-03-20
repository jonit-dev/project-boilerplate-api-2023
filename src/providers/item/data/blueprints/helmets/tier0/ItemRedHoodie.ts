import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier0Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemRedHoodie: IEquippableLightArmorTier0Blueprint = {
  key: HelmetsBlueprint.RedHoodie,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/red-hoodie.png",
  name: "Red Hoodie",
  description: "A simple red hoodie made with cotton. Very useful to hide your identity.",
  defense: 2,
  tier: 0,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 33,
};
