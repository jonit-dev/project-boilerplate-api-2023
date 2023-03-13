import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIronwoodTanto: Partial<IItem> = {
  key: SwordsBlueprint.IronwoodTanto,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/ironwood-tanto.png",
  name: "Ironwood Tanto",
  description: "A small, sharp blade with a brown blade made of ironwood, with a handle wrapped in brown leather.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 13,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 79,
};
