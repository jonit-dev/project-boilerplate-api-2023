import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemStone: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.Stone,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/stone.png",
  name: "Stone",
  description: "A stone. You can easily get more by using your pick on a rock.",
  attack: 8,
  weight: 0.01,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 1,
  canSell: false,
};
