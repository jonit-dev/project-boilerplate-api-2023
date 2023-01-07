import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElvenBow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.ElvenBow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/elven-bow.png",
  name: "Elven Bow",
  description:
    "A bow crafted by the elves, known for their skill in archery. It is said to be incredibly accurate and able to shoot arrows with great speed and distance.",
  attack: 8,
  defense: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 7,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow, RangedWeaponsBlueprint.IronArrow],
  isTwoHanded: true,
  basePrice: 80,
};
