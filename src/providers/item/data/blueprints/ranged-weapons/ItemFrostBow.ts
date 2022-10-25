import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFrostBow: Partial<IItem> = {
  key: RangedWeaponsBlueprint.FrostBow,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/frost-bow.png",

  name: "Frost Bow",
  description: "Ice cristal made bow, formed by the reflection of sunlight from ice crystals floating in the air.",
  weight: 2,
  attack: 8,
  defense: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 9,
  requiredAmmoKeys: [RangedWeaponsBlueprint.Arrow],
  isTwoHanded: true,
};
