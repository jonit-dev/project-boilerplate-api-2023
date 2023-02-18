import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenAxe: Partial<IItem> = {
  key: AxesBlueprint.WoodenAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/wooden-axe.png",
  name: "Training Axe",
  description: "A woodcutting tool with a sharp blade used for chopping wood or as a weapon in combat.",
  weight: 1,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 1,
  defense: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 25,
};
