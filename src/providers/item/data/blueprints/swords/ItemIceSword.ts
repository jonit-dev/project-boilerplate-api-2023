import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemIceSword: Partial<IItem> = {
  key: SwordsBlueprint.IceSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/ice-sword.png",
  textureKey: "ice-sword",
  name: "Ice Sword",
  description: "An ice sword with a blade so thin, that can cut a man in half. ",
  attack: 6,
  defense: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
