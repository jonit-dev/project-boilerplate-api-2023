import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGuardianHelmet: Partial<IItem> = {
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
  allowedEquipSlotType: [ItemSlotType.Head],
};
