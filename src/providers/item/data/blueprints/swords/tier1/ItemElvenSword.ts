import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemElvenSword: IEquippableMeleeTier1WeaponBlueprint = {
  key: SwordsBlueprint.ElvenSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/elven-sword.png",
  name: "Elven Sword",
  description:
    "A slender, finely crafted sword made by skilled elven smiths. It is prized for its light weight and graceful design.",
  attack: 14,
  defense: 10,
  tier: 1,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
