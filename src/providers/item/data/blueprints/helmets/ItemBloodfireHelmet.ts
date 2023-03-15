import { IEquippableArmorBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBloodfireHelmet: IEquippableArmorBlueprint = {
  key: HelmetsBlueprint.BloodfireHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/bloodfire-helmet.png",
  name: "Bloodfire Helmet",
  description:
    "The Bloodfire Helmet is often associated with the ferocity and power of dragons, as well as the destructive potential of characters who specialize in fire-based combat.",
  weight: 1,
  defense: 18,
  allowedEquipSlotType: [ItemSlotType.Head],
};
