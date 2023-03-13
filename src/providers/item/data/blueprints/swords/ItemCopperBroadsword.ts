import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCopperBroadsword: Partial<IItem> = {
  key: SwordsBlueprint.CopperBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/copper-broadsword.png",
  name: "Copper broadsword",
  description: "A basic sword made of copper, suitable for early game battles against weaker enemies.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
