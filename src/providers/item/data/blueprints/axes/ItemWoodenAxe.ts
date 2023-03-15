import { EntityAttackType, IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemWoodenAxe: IEquippableWeaponBlueprint = {
  key: AxesBlueprint.WoodenAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/wooden-axe.png",
  name: "Training Axe",
  description: "A woodcutting tool with a sharp blade used for chopping wood or as a weapon in combat.",
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 1,
  defense: 1,
  rangeType: EntityAttackType.Melee,
  basePrice: 25,
  isTraining: true,
};
