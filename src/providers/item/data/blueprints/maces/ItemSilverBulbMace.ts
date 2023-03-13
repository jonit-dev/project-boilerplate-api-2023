import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { MacesBlueprint } from "../../types/itemsBlueprintTypes";

export const itemSilverBulbMace: Partial<IItem> = {
  key: MacesBlueprint.SilverBulbMace,
  type: ItemType.Weapon,
  subType: ItemSubType.Mace,
  textureAtlas: "items",
  texturePath: "maces/silver-bulb-mace.png",
  name: "Silver Bulb Mace",
  description: "A mace with a silver shaft and a round, bulb-shaped head made of metal.",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 30,
  defense: 10,
  rangeType: EntityAttackType.Melee,
  basePrice: 72,
};
