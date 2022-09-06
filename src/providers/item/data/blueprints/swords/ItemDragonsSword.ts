import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDragonsSword: Partial<IItem> = {
  key: SwordBlueprint.DragonsSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/dragon's-sword.png",
  textureKey: "dragon's-sword",
  name: "Dragon's Sword",
  description: "A mythical sword crafted from the claws and teeth of a fallen dragon to be yielded by a great warrior.",
  attack: 16,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
