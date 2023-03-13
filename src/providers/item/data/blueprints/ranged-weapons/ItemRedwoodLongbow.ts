import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRedwoodLongbow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.RedwoodLongbow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/redwood-longbow.png",
  name: "redwood-longbow",
  description: "A massive, imposing bow made from the giant, majestic wood of the redwood tree.",
  attack: 16,
  defense: 10,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 8,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.ShockArrow,
    RangedWeaponsBlueprint.PoisonArrow,
  ],
  isTwoHanded: true,
  basePrice: 75,
};
