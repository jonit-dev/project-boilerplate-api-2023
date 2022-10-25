import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFrostCrossbow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.FrostCrossbow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/frost-crossbow.png",

  name: "Frost Crossbow",
  description: "The Ice Crossbow is a two-handed crossbow-type ranged weapon.",
  weight: 3,
  attack: 8,
  defense: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 10,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Bolt],
  isTwoHanded: true,
};
