import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { RangedWeaponsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElvenBolt: Partial<IItem> = {
  key: RangedWeaponsBlueprint.ElvenBolt,
  type: ItemType.Weapon,
  subType: ItemSubType.Ranged,
  textureAtlas: "items",
  texturePath: "ranged-weapons/elven-bolt.png",
  name: "Elven Bolt",
  description:
    "An arrow crafted by the elves, known for their skill in archery. It is said to be incredibly accurate and able to pierce even the toughest armor.",
  attack: 9,
  weight: 0.03,
  allowedEquipSlotType: [ItemSlotType.Accessory],
  maxStackSize: 105,
  basePrice: 7,
};
