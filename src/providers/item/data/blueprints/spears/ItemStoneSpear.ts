import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SpearsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemStoneSpear: Partial<IItem> = {
  key: SpearsBlueprint.StoneSpear,
  type: ItemType.Weapon,
  subType: ItemSubType.Spear,
  textureAtlas: "items",
  texturePath: "spears/stone-spear.png",
  name: "Stone Spear",
  description: "Basic melee weapon made of a wooden stick and a pointed head made of stone.",
  attack: 4,
  defense: 1,
  weight: 3,
  isTwoHanded: true,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  maxRange: 7,
  rangeType: EntityAttackType.Melee,

  basePrice: 7,
};
