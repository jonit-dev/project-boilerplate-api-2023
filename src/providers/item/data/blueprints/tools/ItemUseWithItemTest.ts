import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { IItemUseWithEntity } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemUseWithItemTest: Partial<IItemUseWithEntity> = {
  key: ToolsBlueprint.UseWithItemTest,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/fishing-rod.png",
  name: "Use With Test Item",
  description: "Just a dummy item to test the use with feature. Don't use it for anything else!",
  weight: 0.25,
  hasUseWith: true,
  basePrice: 70,
  useWithMaxDistanceGrid: 2,
  useWithItemEffect: async (targetItem: IItem, originItem: IItem, character: ICharacter): Promise<void> => {
    targetItem.name = "Item affected by use with effect!";
    await targetItem.save();
  },
};
