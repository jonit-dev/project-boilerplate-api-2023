import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { SwordsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemKatana: Partial<IItem> = {
  key: SwordsBlueprint.Katana,
  type: ItemType.Weapon,
  subType: ItemSubType.Sword,
  textureAtlas: "items",
  texturePath: "swords/katana.png",

  name: "Katana",
  description: "A katana.",
  attack: 6,
  defense: 0,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  sellPrice: 60,
};
