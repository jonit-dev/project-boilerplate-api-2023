import { IEquippableMeleeTier7WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemJadeBlade: IEquippableMeleeTier7WeaponBlueprint = {
  key: SwordsBlueprint.JadeBlade,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/jade-blade.png",
  name: "Jade Blade",
  description:
    "Created by monks of the Daoist sect, the JadeBlade was imbued with the essence of yin and yang, making it a masterful balance of both offense and defense.",
  attack: 56,
  defense: 40,
  tier: 7,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 135,
};
