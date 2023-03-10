import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalBow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.RoyalBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/royal-bow.png",
  name: "Royal Bow",
  description:
    " powerful, ornate bow often given as a symbol of royal power. It is often made of gold or other precious materials and may be intricately decorated with engravings or gemstones.",
  attack: 18,
  defense: 8,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand],
  maxRange: 7,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow],
  isTwoHanded: true,
  basePrice: 65,
};
