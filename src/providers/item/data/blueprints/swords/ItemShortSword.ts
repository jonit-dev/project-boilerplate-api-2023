import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordBlueprint } from "../../types/itemsBlueprintTypes";

export const itemShortSword: Partial<IItem> = {
  key: SwordBlueprint.ShortSword,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/short-sword.png",
  textureKey: "short-sword",
  name: "Short Sword",
  description: "You see a short sword. It is a single-handed sword with a handle that just features a grip.",
  attack: 5,
  defense: 0,
  weight: 10,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
