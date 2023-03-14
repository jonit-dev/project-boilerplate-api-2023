import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { AccessoriesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPendantOfMana: Partial<IItem> = {
  key: AccessoriesBlueprint.PendantOfMana,
  type: ItemType.Accessory,
  subType: ItemSubType.Accessory,
  textureAtlas: "items",
  texturePath: "accessories/pendant-of-mana.png",
  name: "Pendant Of Mana",
  description:
    "Crafted from rare and magical materials, the Pendant of Mana is often adorned with symbols of magic and mysticism, such as stars or moons. It is said that the pendant shimmers with a brilliant and otherworldly light, resonating with the power of arcane forces.",
  attack: 0,
  defense: 0,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.Ring],
  basePrice: 5000,
};