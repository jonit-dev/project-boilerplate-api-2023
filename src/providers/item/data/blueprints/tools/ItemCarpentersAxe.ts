import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { IItemUseWith, IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCarpentersAxe: Partial<IItemUseWith> = {
  key: ToolsBlueprint.CarpentersAxe,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/carpenters-axe.png",
  name: "Carpenter's Axe",
  description: "An axe designed primarily as a work axe.",
  attack: 6,
  defense: 2,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
  hasUseWith: true,
  useWithMaxDistanceGrid: 2,
  useWithTileEffect: (originItem: IItem, targetTile: IUseWithTargetTile, targetName: string, character: ICharacter) => {
    // @ISLAM DO THE TASK HERE
    console.log(originItem, targetTile);
  },
};
