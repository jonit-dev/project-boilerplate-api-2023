import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSilverAxe: Partial<IItem> = {
  key: AxesBlueprint.SilverAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/silver-axe.png",
  name: "Silver Axe",
  description: "An axe made of silver, with a sharp edge and a sturdy handle.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 17,
  defense: 5,
  rangeType: EntityAttackType.Melee,
  basePrice: 48,
};
