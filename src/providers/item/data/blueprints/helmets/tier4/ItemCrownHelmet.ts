import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier4Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCrownHelmet: IEquippableLightArmorTier4Blueprint = {
  key: HelmetsBlueprint.CrownHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/crown-helmet.png",
  name: "Crown Helmet",
  description:
    "A crown helmet is a regal headpiece adorned with intricate gold and jewel designs, fit for a king or queen.",
  weight: 1,
  defense: 22,
  tier: 4,
  allowedEquipSlotType: [ItemSlotType.Head],
};
