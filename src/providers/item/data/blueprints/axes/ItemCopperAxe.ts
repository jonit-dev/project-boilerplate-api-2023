import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCopperAxe: Partial<IItem> = {
  key: AxesBlueprint.CopperAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/copper-axe.png",
  name: "Copper Axe",
  description: "A basic axe made of copper, suitable for fighting enemies.",
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 15,
  defense: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 40,
};
