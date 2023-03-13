import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElmReflexBow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.ElmReflexBow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  rangeType: EntityAttackType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/elm-reflex-bow.png",
  name: "Elm Reflex Bow",
  description: "A responsive, flexible bow made from the supple, elastic wood of the elm tree.",
  attack: 14,
  defense: 7,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 9,
  requiredAmmoKeys: [
    RangedWeaponsBlueprint.Arrow,
    RangedWeaponsBlueprint.IronArrow,
    RangedWeaponsBlueprint.PoisonArrow,
  ],
  isTwoHanded: true,
  basePrice: 70,
};
