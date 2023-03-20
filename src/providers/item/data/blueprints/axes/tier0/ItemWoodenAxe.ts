import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { IEquippableMeleeTier0WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWoodenAxe: IEquippableMeleeTier0WeaponBlueprint = {
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
  tier: 0,
  rangeType: EntityAttackType.Melee,
  basePrice: 25,
  isTraining: true,
};
