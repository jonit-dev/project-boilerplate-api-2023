import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { DaggersBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSaiDagger: Partial<IItem> = {
  key: DaggersBlueprint.SaiDagger,
  type: ItemType.Weapon,
  subType: ItemSubType.Dagger,
  textureAtlas: "items",
  texturePath: "daggers/sai-dagger.png",
  name: "Sai Dagger",
  description:
    "A Japanese weapon consisting of a pointed, prong-shaped blade mounted on a long handle. It is often used for thrusting and parrying, and is known for its versatility in close combat.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 8,
  defense: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 49,
};