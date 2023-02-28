import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorruptionDagger: Partial<IItem> = {
  key: DaggersBlueprint.CorruptionDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/corruption-dagger.png",

  name: "Corruption Dagger",
  description: "An artifact from ancient times. Its blade allows it to cut in ways no other weapon could.",
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 5,
  defense: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 44,
};
