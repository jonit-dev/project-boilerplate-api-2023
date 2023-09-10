import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemEarthArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.EarthArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/earth-arrow.png",
  name: "Earth Arrow",
  description:
    "Infused with the elemental power of Earth, this arrow creates a mini-tremor upon impact. Effective for disrupting enemy formations and unbalancing foes.",
  weight: 0.1,
  maxStackSize: 999,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  basePrice: 8,
  attack: 20,
  canSell: false,
};
