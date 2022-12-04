import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHammer: Partial<IItem> = {
  key: ToolsBlueprint.Hammer,
  type: ItemType.Tool,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "hammers/hammer.png",
  name: "Blacksmith's Hammer",
  description: "A simple hammer used as a weapon or for blacksmithing.",
  attack: 5,
  defense: 2,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
};
