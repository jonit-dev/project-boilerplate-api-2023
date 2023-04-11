import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityEffectBlueprint } from "@providers/entityEffects/data/types/entityEffectBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemHellishMace: Partial<IItem> = {
  key: MacesBlueprint.HellishMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/hellish-mace.png",
  name: "Hellish Mace",
  description: "The Hellish Mace is a heavy, one-handed weapon that emphasizes power and precision.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 80,
  defense: 40,
  rangeType: EntityAttackType.Melee,
  entityEffects: [EntityEffectBlueprint.Burning],
  entityEffectChance: 70,
};
