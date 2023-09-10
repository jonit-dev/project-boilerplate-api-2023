import { IEquippableMeleeTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemMoonBeamAxe: IEquippableMeleeTier7WeaponBlueprint = {
  key: AxesBlueprint.MoonBeamAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/moon-beam-axe.png",
  name: "Moon Beam Axe",
  description:
    "A single-blade axe infused with lunar energy, it shines brightest under the full moon and gains strength during nighttime.",
  weight: 1.7,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 57,
  defense: 52,
  tier: 7,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
