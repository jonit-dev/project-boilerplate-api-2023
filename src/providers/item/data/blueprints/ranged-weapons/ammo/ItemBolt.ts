import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemBolt: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.Bolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/bolt.png",
  name: "Bolt",
  description: "A crossbow bolt.",
  attack: 14,
  weight: 0.04,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 999,
  basePrice: 2,
  canSell: false,
};
