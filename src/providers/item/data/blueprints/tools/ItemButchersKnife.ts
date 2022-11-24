import { IItemUseWith } from "@providers/useWith/useWithTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemButchersKnife: Partial<IItemUseWith> = {
  key: ToolsBlueprint.ButchersKnife,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/butchers-knife.png",
  name: "Butcher's Knife",
  description: "A bladed melee knife that can be used as a tool or weapon.",
  attack: 5,
  defense: 2,
  weight: 1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 45,
  hasUseWith: true,
  useWithMaxDistanceGrid: 2,
};
