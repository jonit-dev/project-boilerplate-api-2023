import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionSword: Partial<IItem> = {
  key: SwordsBlueprint.CorruptionSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/corruption-sword.png",
  name: "Corruption Sword",
  description:
    "A sinister sword imbued with corrupting energies, capable of sapping the strength and vitality of its victims.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 15,
  defense: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
