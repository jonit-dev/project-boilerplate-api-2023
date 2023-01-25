import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalDoubleAxe: Partial<IItem> = {
  key: AxesBlueprint.RoyalDoubleAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/royal-double-axe.png",
  name: "Royal Double Axe",
  description:
    "A large, two-handed axe with two parallel heads connected by a short handle. It is often given as a symbol of royal power and is wielded by elite soldiers in ceremonial guard units.",
  attack: 33,
  defense: 7,
  weight: 4.2,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
