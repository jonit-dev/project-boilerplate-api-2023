import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemjavelin: Partial<IItem> = {
  key: SpearsBlueprint.Javelin,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/javelin.png",
  name: "javelin",
  description: "A type of spear designed for throwing",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 8,
  defense: 0,
  rangeType: EntityAttackType.Ranged,
  basePrice: 75,
};
