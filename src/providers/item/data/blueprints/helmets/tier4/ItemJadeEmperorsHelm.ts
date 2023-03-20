import { IEquippableLightArmorTier4Blueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { HelmetsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemJadeEmperorsHelm: IEquippableLightArmorTier4Blueprint = {
  key: HelmetsBlueprint.JadeEmperorsHelm,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/jade-emperors-helm.png",
  name: "Jade Emperor's Helm",
  description:
    "Crafted from the finest jade, it is adorned with intricate carvings and embellishments that depict the glory and wisdom of the Jade Emperor, ruler of the heavens and earth.",
  weight: 1,
  defense: 19,
  tier: 4,
  allowedEquipSlotType: [ItemSlotType.Head],
};
