import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDamascusSword: Partial<IItem> = {
  key: SwordsBlueprint.DamascusSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/damascus-sword.png",
  name: "Damascus Sword",
  description: "A sword made with Damascus steel, known for its strength and beauty",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 15,
  defense: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 85,
};
