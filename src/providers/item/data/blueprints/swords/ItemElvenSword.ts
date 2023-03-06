import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemElvenSword: Partial<IItem> = {
  key: SwordsBlueprint.ElvenSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/elven-sword.png",
  name: "Elven Sword",
  description:
    "A slender, finely crafted sword made by skilled elven smiths. It is prized for its light weight and graceful design.",
  attack: 12,
  defense: 8,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 70,
};
