import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemjavelin: Partial<IItem> = {
  key: SpearsBlueprint.Javelin,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/javelin.png",
  name: "javelin",
  description:
    "A type of spear designed for throwing, used in ancient Greek and Roman warfare. It has a slender, streamlined design that allows it to be thrown with great accuracy and force.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 9,
  defense: 2,
  isTwoHanded: true,
  rangeType: EntityAttackType.Ranged,
  basePrice: 75,
};
