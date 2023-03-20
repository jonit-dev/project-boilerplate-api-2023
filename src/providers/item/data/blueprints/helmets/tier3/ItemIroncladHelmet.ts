import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemIroncladHelmet: IEquippableLightArmorTier3Blueprint = {
  key: HelmetsBlueprint.IroncladHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/ironclad-helmet.png",
  name: "Ironclad Helmet",
  description:
    "The Ironclad Helmet is a formidable piece of armor that provides its wearer with unparalleled protection on the battlefield",
  weight: 1,
  defense: 16,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Head],
};
