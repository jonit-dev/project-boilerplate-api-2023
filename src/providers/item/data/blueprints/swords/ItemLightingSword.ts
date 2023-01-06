import { IItem } from "@entities/ModuleInventory/ItemModel";
import { EntityAttackType, ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemLightingSword: Partial<IItem> = {
  key: SwordsBlueprint.LightingSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/lighting-sword.png",
  name: "Lighting Sword",
  description: "A sword that can generate or control lightning",
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  attack: 15,
  defense: 3,
  rangeType: EntityAttackType.Melee,
  basePrice: 78,
};
