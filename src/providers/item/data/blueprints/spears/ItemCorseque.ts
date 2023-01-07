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
  description:
    "A type of spear with a curved, hook-like blade, typically used for grappling and disarming opponents. Its design allows for quick and agile movements in close combat.",
  weight: 6,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 7,
  defense: 6,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
};
