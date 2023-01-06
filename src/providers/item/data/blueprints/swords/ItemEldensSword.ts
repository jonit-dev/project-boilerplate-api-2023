import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEldensSword: Partial<IItem> = {
  key: SwordsBlueprint.EldensSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/eldens-sword.png",
  name: "Eldens Sword",
  description: "A mythical sword associated with the Eldens",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 10,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
