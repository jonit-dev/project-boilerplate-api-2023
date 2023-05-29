import { IEquippableRangedAmmoBlueprint, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../../types/itemsBlueprintTypes";

export const itemFrostArrow: IEquippableRangedAmmoBlueprint = {
  key: RangedWeaponsBlueprint.FrostArrow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/frost-arrow.png",
  name: "Frost Arrow",
  description: "An arrow infused with icy energy, chilling enemies on impact.",
  attack: 25,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 50,
  basePrice: 10,
};
