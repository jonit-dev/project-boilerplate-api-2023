import { IEquippableMeleeTier12WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemWarlordBroadsword: IEquippableMeleeTier12WeaponBlueprint = {
  key: SwordsBlueprint.WarlordBroadsword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/warlord-broadsword.png",
  name: "Warlord Broadsword",
  description:
    "Once owned by a legendary warlord, this sword grants superior leadership abilities, increasing the effectiveness of allied troops.",
  attack: 90,
  defense: 88,
  tier: 12,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 200,
};
