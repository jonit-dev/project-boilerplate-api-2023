import { IEquippableMeleeTier9WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AxesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGloriousAxe: IEquippableMeleeTier9WeaponBlueprint = {
  key: AxesBlueprint.GloriousAxe,
  type: ItemType.Weapon,
  subType: ItemSubType.Axe,
  textureAtlas: "items",
  texturePath: "axes/glorious-axe.png",
  name: "Glorious Axe",
  description:
    "Adorned with gold and gemstones, this exquisite axe is the epitome of majesty and grandeur, boosting morale and enhancing charisma-based skills.",
  weight: 3.2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 70,
  defense: 65,
  tier: 9,
  rangeType: EntityAttackType.Melee,
  basePrice: 94,
};
