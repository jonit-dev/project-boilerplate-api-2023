import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { IEquippableWeaponBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireSword: IEquippableWeaponBlueprint = {
  key: SwordsBlueprint.FireSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/fire-sword.png",
  name: "Fire Sword",
  description:
    "A sword imbued with the power of flames, capable of unleashing fiery attacks and generating intense heat.",
  attack: 18,
  defense: 8,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 74,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 70,
};
