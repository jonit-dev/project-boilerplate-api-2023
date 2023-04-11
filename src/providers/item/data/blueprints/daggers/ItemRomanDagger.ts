import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRomanDagger: Partial<IItem> = {
  key: DaggersBlueprint.RomanDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/roman-dagger.png",
  name: "Roman Dagger",
  description: "The Roman Dagger is a lightweight weapon that emphasizes speed and agility.",
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 60,
  defense: 20,
  rangeType: EntityAttackType.Melee,
};
