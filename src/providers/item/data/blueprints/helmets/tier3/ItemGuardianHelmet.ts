import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGuardianHelmet: IEquippableLightArmorTier3Blueprint = {
  key: HelmetsBlueprint.GuardianHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/guardian-helmet.png",
  name: "Guardian Helmet",
  description:
    "The Guardian Helmet is a sturdy and imposing headpiece designed to provide its wearer with maximum protection in battle",
  weight: 1,
  defense: 14,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Head],
};
