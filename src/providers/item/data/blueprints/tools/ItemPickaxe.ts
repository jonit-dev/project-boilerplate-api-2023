import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPickaxe: Partial<IItemUseWith> = {
  key: ToolsBlueprint.Pickaxe,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/pickaxe.png",
  name: "Pickaxe",
  description: "A tool used for mining, breaking rocks or even as a weapon.",
  attack: 4,
  defense: 2,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
  hasUseWith: true,
  useWithMaxDistanceGrid: 2,
};
