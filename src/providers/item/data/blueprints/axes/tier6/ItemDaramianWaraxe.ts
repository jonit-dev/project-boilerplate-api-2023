import { IEquippableTwoHandedTier6WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDaramianWaraxe: IEquippableTwoHandedTier6WeaponBlueprint = {
  key: AxesBlueprint.DaramianWaraxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/daramian-waraxe.png",
  name: "Daramian Waraxe",
  description:
    "A darkened steel blade adorned with golden inlays, embodying the fearsome legacy of ancient Daramian warriors.",
  weight: 4.8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 100,
  defense: 48,
  isTwoHanded: true,
  tier: 6,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
};
