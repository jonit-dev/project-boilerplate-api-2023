import { IEquippableMeleeTier2WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { AxesBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemSilverAxe: IEquippableMeleeTier2WeaponBlueprint = {
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
  tier: 2,
  rangeType: EntityAttackType.Melee,
  basePrice: 48,
};
