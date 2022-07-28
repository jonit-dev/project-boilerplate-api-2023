import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordBlueprint } from "../../types/itemsBlueprintTypes";

export const itemKnightsSword: Partial<IItem> = {
  key: SwordBlueprint.KnightsSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/knights-sword.png",
  textureKey: "knights-sword",
  name: "Knights Sword",
  description: "A well crafted sword used by the knights.",
  attack: 8,
  defense: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};