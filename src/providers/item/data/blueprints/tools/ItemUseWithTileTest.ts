import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { IItemUseWithEntity, IUseWithTargetTile, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemUseWithTileTest: Partial<IItemUseWithEntity> = {
  key: ToolsBlueprint.UseWithTileTest,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/carpenters-axe.png",
  name: "Use With Test Item",
  description: "Just a dummy item to test the use with feature. Don't use it for anything else!",
  weight: 0.25,
  hasUseWith: true,
  basePrice: 70,
  useWithTileEffect: async (item: IItem, targetTile: IUseWithTargetTile, character: ICharacter): Promise<void> => {
    character.name = "Character affected by use with tile effect!";
    await character.save();
  },
};
