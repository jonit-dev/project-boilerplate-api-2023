import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDagger: Partial<IItem> = {
  key: DaggersBlueprint.Dagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/dagger.png",

  name: "Dagger",
  description:
    "You see a dagger. It's a fighting knife with a very sharp point and usually two sharp edges, typically designed or capable of being used as a thrusting or stabbing weapon.",
  attack: 5,
  defense: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 38,
};
