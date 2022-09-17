import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { RangedBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBow: Partial<IItem> = {
  key: RangedBlueprint.Bow,
  type: ItemType.Weapon,
  rangeType: EntityAttackType.Ranged,
  subType: ItemSubType.Bow,
  textureAtlas: "items",
  texturePath: "bows/bow.png",
  textureKey: "Bow",
  name: "Bow",
  description:
    "A weapon used for shooting arrows and usually made of a strip of wood bent by a cord connecting the two end.",
  attack: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 7,
  requiredAmmoKey: RangedBlueprint.Arrow,
  isTwoHanded: true,
};
