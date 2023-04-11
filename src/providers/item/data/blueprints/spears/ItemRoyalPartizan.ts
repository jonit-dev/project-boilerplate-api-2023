import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalPartizan: Partial<IItem> = {
  key: SpearsBlueprint.RoyalPartizan,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/royal-partizan.png",
  name: "Royal Partizan",
  description: "The Royal Partizan Spear is a versatile weapon that can be wielded with great precision and skill.",
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 85,
  defense: 30,
  isTwoHanded: true,
  maxRange: 4,
  rangeType: EntityAttackType.MeleeRanged,
};
