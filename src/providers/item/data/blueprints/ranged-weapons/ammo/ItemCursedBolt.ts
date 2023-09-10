import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCursedBolt: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.CursedBolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/cursed-bolt.png",
  name: "Cursed Bolt",
  description: "Imbued with a dark hex that curses enemies upon impact. The curse reduces enemy stats temporarily.",
  weight: 0.1,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 8,
  attack: 25,
  canSell: false,
};
