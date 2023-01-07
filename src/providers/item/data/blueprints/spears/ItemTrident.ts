import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemtrident: Partial<IItem> = {
  key: SpearsBlueprint.Trident,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/trident.png",
  name: "Trident",
  description: "A type of spear with three prongs or points, famously wielded by the sea god Poseidon.",
  weight: 8,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 12,
  defense: 4,
  rangeType: EntityAttackType.Melee,
  basePrice: 80,
};
