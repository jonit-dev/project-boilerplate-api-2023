import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRapier: Partial<IItem> = {
  key: SwordsBlueprint.Rapier,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/rapier.png",
  name: "Rapier",
  description: "A slender, pointed sword with a sharp, thin blade",
  weight: 0.75,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 8,
  defense: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
