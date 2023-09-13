import { IEquippableMeleeTier11WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { HammersBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemGoldHammer: IEquippableMeleeTier11WeaponBlueprint = {
  key: HammersBlueprint.GoldHammer,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "hammers/gold-hammer.png",
  name: "Gold Hammer",
  description:
    "A luxuriously crafted hammer made entirely of gold, offering both opulence and surprising effectiveness in battle.",
  weight: 2.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 85,
  defense: 44,
  tier: 11,
  rangeType: EntityAttackType.Melee,
};
