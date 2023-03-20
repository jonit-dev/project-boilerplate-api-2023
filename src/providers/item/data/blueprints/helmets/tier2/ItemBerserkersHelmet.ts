import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier2Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemBerserkersHelmet: IEquippableLightArmorTier2Blueprint = {
  key: HelmetsBlueprint.BerserkersHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/berserkers-helmet.png",
  name: "Berserkers Helmet",
  description:
    "Berserker Helmet is an enclosed helmet designed to protect the entire head while intimidating enemies on the battlefield.",
  defense: 9,
  tier: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.Head],
  basePrice: 49,
};
