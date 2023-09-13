import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemCrystallineArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.CrystallineArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/crystalline-arrow.png",
  name: "Crystalline Arrow",
  description:
    "Forged from magical crystals, this arrow shimmers in multiple colors. It releases a burst of arcane energy upon impact, dealing bonus magical damage.",
  weight: 0.1,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 6,
  attack: 27,
  canSell: false,
};
