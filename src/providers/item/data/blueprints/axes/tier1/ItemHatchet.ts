import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHatchet: IEquippableMeleeTier1WeaponBlueprint = {
  key: AxesBlueprint.Hatchet,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/hatchet.png",
  name: "Hatchet",
  description:
    "A small, single-handed axe with a short handle and a narrow, pointed head. It is often used for chopping and splitting wood, but can also be used as a weapon in close combat.",
  attack: 15,
  defense: 3,
  tier: 1,
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 67,
};
