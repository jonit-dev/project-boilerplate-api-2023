import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemJadeEmperorsHelm: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.JadeEmperorsHelm,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/jade-emperors-helm.png",
  name: "Jade Emperor's Helm",
  description:
    "Crafted from the finest jade, it is adorned with intricate carvings and embellishments that depict the glory and wisdom of the Jade Emperor, ruler of the heavens and earth.",
  weight: 1,
  defense: 17,
  allowedEquipSlotType: [ItemSlotType.Head],
};
