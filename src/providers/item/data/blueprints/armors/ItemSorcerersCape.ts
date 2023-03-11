import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { ArmorsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSorcerersCape: Partial<IItem> = {
  key: ArmorsBlueprint.SorcerersCape,
  type: ItemType.Armor,
  subType: ItemSubType.Armor,
  textureAtlas: "items",
  texturePath: "armors/sorcerers-cape.png",
  name: "Sorcerer's Cape",
  description:
    "Crafted from rare and exotic materials such as moonstone, star metal, or etherium, Sorcerer's Cape is adorned with intricate designs and symbols of arcane magic.",
  weight: 1,
  defense: 25,
};
