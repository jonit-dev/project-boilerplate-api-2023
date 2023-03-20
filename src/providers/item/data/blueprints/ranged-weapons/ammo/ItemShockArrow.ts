import { RangedWeaponsBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";

export const itemShockArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.ShockArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/shock-arrow.png",
  name: "Shock Arrow",
  description: "An arrow infused with electricity that deals heavy damage.",
  attack: 16,
  weight: 0.05,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 100,
  basePrice: 2,
};
