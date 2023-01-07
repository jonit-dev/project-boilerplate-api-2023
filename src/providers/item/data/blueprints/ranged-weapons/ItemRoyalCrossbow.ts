import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalCrossbow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.RoyalCrossbow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/royal-crossbow.png",
  name: "Royal Crossbow",
  description:
    "A powerful, ornate crossbow often given as a symbol of royal power. It is often made of gold or other precious materials and may be intricately decorated with engravings or gemstones. It has a horizontal limb assembly mounted on a stock that fires projectiles using a horizontal bow-like string.",
  weight: 4,
  attack: 9,
  defense: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 12,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Bolt],
  isTwoHanded: true,
  basePrice: 95,
};
