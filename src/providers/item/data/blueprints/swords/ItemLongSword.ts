import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLongSword: Partial<IItem> = {
  key: SwordsBlueprint.LongSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/long-sword.png",
  name: "Long Sword",
  description: "A sword with a long, slender blade",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 8,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
