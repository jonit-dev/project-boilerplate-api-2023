import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemTemplarSword: Partial<IItem> = {
  key: SwordsBlueprint.TemplarSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/templar-sword.png",
  name: "templar-sword",
  description:
    "The blade of a Templar sword is typically made of high-quality steel and features a straight, double-edged shape that is ideal for thrusting and cutting",
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 50,
  defense: 12,
  rangeType: EntityAttackType.Melee,
  isTwoHanded: true,
};
