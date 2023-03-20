import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier5WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemDragonsSword: IEquippableMeleeTier5WeaponBlueprint = {
  key: SwordsBlueprint.DragonsSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/dragon's-sword.png",
  name: "Dragon's Sword",
  description:
    "A legendary sword crafted from the remains of a mighty dragon, wielded only by the greatest of warriors.",
  attack: 40,
  defense: 37,
  tier: 5,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 121,
};