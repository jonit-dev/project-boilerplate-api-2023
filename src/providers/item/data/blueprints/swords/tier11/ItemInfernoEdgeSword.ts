import { IEquippableMeleeTier11WeaponBlueprint } from "@providers/item/data/types/TierBlueprintTypes";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemInfernoEdgeSword: IEquippableMeleeTier11WeaponBlueprint = {
  key: SwordsBlueprint.InfernoEdgeSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/inferno-edge-sword.png",
  name: "Inferno Edge Sword",
  description: "A sword engulfed in ever-burning flames, capable of igniting enemies on impact.",
  attack: 82,
  defense: 80,
  tier: 11,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 185,
};
