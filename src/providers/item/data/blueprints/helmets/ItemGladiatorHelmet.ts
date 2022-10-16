import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HelmetsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemGladiatorHelmet: Partial<IItem> = {
  key: HelmetsBlueprint.GladiatorHelmet,
  type: ItemType.Armor,
  subType: ItemSubType.Helmet,
  textureAtlas: "items",
  texturePath: "helmets/gladiator's-helmet.png",
  name: "Gladiator Helmet",
  description:
    "For antiquity, gladiator helmets were unique in their design. This helmet was designed to help maximize defense.",
  defense: 8,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.Head],
};
