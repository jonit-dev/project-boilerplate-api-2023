import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemBlueAuroraSpear: Partial<IItem> = {
  key: SpearsBlueprint.BlueAuroraSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/blue-aurora-spear.png",
  name: "Blue Aurora Spear",
  description:
    "A spear with a blue and white shaft that is imbued with the power of the Northern Lights and has a sharp, pointed blade.",
  weight: 4,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 22,
  defense: 10,
  isTwoHanded: true,
  rangeType: EntityAttackType.Melee,
  basePrice: 45,
};
