import { IEquippableMeleeTier11WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldenReaverAxe: IEquippableMeleeTier11WeaponBlueprint = {
  key: AxesBlueprint.GoldenReaverAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/golden-reaver-axe.png",
  name: "Golden Reaver Axe",
  description:
    "Its golden blade glimmers in the sunlight, intimidating foes and inspiring allies with its sheer splendor.",
  weight: 3.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 85,
  defense: 82,
  tier: 11,
  rangeType: EntityAttackType.Melee,
  basePrice: 105,
};
