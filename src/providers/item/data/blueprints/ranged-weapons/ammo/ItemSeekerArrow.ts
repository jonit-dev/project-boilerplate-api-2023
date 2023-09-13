import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemSeekerArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.SeekerArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/seeker-arrow.png",
  name: "Seeker Arrow",
  description:
    "Programmed with advanced AI, these arrows can change their course mid-flight. Near impossible to evade.",
  weight: 0.1,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 8,
  attack: 28,
  canSell: false,
};
