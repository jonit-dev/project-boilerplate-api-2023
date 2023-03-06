import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemDragonBow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.DragonBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/dragon-bow.png",
  name: "Dragon Bow",
  description: "A powerful bow made from dragon bones.",
  attack: 35,
  defense: 10,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 9,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.GoldenArrow,
    RangedWeaponsBlueprint.PoisonArrow,
    RangedWeaponsBlueprint.ShockArrow,
  ],
  isTwoHanded: true,
  basePrice: 90,
};
