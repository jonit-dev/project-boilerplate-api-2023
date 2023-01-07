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
  description:
    "A finely crafted sword made of Damascus steel, known for its exceptional strength and beautiful patterns.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 85,
};
