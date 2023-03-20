import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableTwoHandedTier3WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDwarvenWaraxe: IEquippableTwoHandedTier3WeaponBlueprint = {
  key: AxesBlueprint.DwarvenWaraxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/dwarven-waraxe.png",
  name: "Dwarven Waraxe",
  description:
    "A waraxe designed and crafted by dwarves, known for their skill in metalworking. It is said to be incredibly durable and able to withstand heavy use in battle.",
  attack: 50,
  defense: 27,
  tier: 3,
  weight: 2,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 64,
};
