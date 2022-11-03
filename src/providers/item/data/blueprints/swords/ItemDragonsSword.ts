import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDragonsSword: Partial<IItem> = {
  key: SwordsBlueprint.DragonsSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/dragon's-sword.png",
  name: "Dragon's Sword",
  description: "A mythical sword crafted from the claws and teeth of a fallen dragon to be yielded by a great warrior.",
  attack: 16,
  defense: 8,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  sellPrice: 200,
};
