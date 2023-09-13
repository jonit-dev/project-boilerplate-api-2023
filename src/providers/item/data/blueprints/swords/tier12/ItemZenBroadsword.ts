import { IEquippableMeleeTier12WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemZenBroadsword: IEquippableMeleeTier12WeaponBlueprint = {
  key: SwordsBlueprint.ZenBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/zen-broadsword.png",
  name: "Zen Broadsword",
  description:
    "This sword calms the mind and sharpens the senses, allowing for unparalleled focus and precision in combat.",
  attack: 90,
  defense: 90,
  tier: 12,
  weight: 1.4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 200,
};
