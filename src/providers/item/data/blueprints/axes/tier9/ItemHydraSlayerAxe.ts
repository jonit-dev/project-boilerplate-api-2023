import { IEquippableTwoHandedTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHydraSlayerAxe: IEquippableTwoHandedTier9WeaponBlueprint = {
  key: AxesBlueprint.HydraSlayerAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/hydra-slayer-axe.png",
  name: "Hydra Slayer Axe",
  description: "Designed to combat multi-headed creatures, its double blades can sever two heads at once.",
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 146,
  defense: 70,
  isTwoHanded: true,
  tier: 9,
  rangeType: EntityAttackType.Melee,
  basePrice: 150,
};
