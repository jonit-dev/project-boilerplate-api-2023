import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { ShieldsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemScutumShield: Partial<IItem> = {
  key: ShieldsBlueprint.ScutumShield,
  type: ItemType.Armor,
  subType: ItemSubType.Shield,
  textureAtlas: "items",
  texturePath: "shields/scutum-shield.png",
  textureKey: "scutum-shield",
  name: "Scutum Shield",
  description: "The Scutum Shield was used by the ancient roman armies. You could build a house from these.",
  defense: 15,
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
};
