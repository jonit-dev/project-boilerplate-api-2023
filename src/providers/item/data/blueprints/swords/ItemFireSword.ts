import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFireSword: Partial<IItem> = {
  key: SwordBlueprint.FireSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/fire-sword.png",
  textureKey: "fire-sword",
  name: "Fire Sword",
  description: "A sword with the power of flames.",
  attack: 12,
  defense: 0,
  weight: 1.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
