import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { IEquippableMeleeTier1WeaponBlueprint } from "../../../types/TierBlueprintTypes";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemShortSword: IEquippableMeleeTier1WeaponBlueprint = {
  key: SwordsBlueprint.ShortSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/short-sword.png",
  name: "Short Sword",
  description:
    "A single-handed sword with a short, compact blade and a grip handle, suitable for quick and agile attacks.",
  attack: 10,
  defense: 9,
  tier: 1,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 68,
};
