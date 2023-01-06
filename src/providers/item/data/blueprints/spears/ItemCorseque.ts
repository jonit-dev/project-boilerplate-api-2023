import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCorseque: Partial<IItem> = {
  key: SpearsBlueprint.Corseque,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/corseque.png",
  name: "Corseque",
  description: "A type of spear with a curved blade",
  weight: 6,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 5,
  defense: 4,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
