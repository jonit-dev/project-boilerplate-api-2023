import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableLightArmorTier3Blueprint } from "../../../types/TierBlueprintTypes";
import { HelmetsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemAmethystHelmet: IEquippableLightArmorTier3Blueprint = {
  key: HelmetsBlueprint.AmethystHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/amethyst-helmet.png",
  name: "Amethyst Helmet",
  description:
    "The Amethyst Helmet is often associated with the power and mystique of gemstones, as well as the potent magical abilities of characters who specialize in spellcasting.",
  weight: 0.7,
  defense: 14,
  tier: 3,
  allowedEquipSlotType: [ItemSlotType.Head],
};
