import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemYggdrasilGladius: Partial<IItem> = {
  key: SwordsBlueprint.YggdrasilGladius,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/yggdrasil-gladius.png",
  name: "Yggdrasil Gladius",
  description: "Crafted from the sturdy wood of Yggdrasil, this gladius sword was unlike any other.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 75,
  defense: 20,
  rangeType: EntityAttackType.Melee,
};
