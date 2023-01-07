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
  description: "A sword with a long, slender blade, favored for its versatility and reach in combat.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 14,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
