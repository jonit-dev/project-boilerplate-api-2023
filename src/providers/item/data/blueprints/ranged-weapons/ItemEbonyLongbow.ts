import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemEbonyLongbow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.EbonyLongbow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/ebony-longbow.png",
  name: "Ebony Longbow",
  description: "A powerful, intimidating bow made from the dark, heavy wood of the ebony tree.",
  attack: 13,
  defense: 6,
  weight: 0.75,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 8,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow],
  isTwoHanded: true,
  basePrice: 65,
};
