import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemRoyalPike: Partial<IItem> = {
  key: SpearsBlueprint.RoyalPike,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/royal-pike.png",
  name: "Royal Pike",
  description:
    "The Royal Pike Spear is a formidable weapon that can pierce through armor and shields with ease, thanks to its high Attack rating.",
  weight: 3,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 95,
  defense: 20,
  isTwoHanded: true,
  maxRange: 3,
  rangeType: EntityAttackType.MeleeRanged,
};
