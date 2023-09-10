import { IEquippableMeleeTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSilverFistMace: IEquippableMeleeTier7WeaponBlueprint = {
  key: MacesBlueprint.SilverFistMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/silver-fist-mace.png",
  name: "Silver Fist Mace",
  description:
    "A mace cast entirely in silver, the Silver Fist is known for its sleek design and reflective surface. It specializes in damaging supernatural creatures and leaves a shimmering imprint upon impact.",
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 56,
  defense: 32,
  tier: 7,
  rangeType: EntityAttackType.Melee,
};
