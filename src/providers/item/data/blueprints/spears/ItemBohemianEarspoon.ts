import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBohemianEarspoon: Partial<IItem> = {
  key: SpearsBlueprint.BohemianEarspoon,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/bohemian-earspoon.png",
  name: "Bohemian Earspoon",
  description: "A type of spear with a crescent-shaped blade",
  weight: 5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 6,
  defense: 2,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
};
