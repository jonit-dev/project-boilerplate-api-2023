import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemCraftable } from "@providers/item/ItemCraftable";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { IItemUseWith, IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemUseWithTileTest: Partial<IItemUseWith> = {
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
  useWithMaxDistanceGrid: 2,
  useWithTileEffect: async (
    item: IItem,
    targetTile: IUseWithTargetTile,
    source,
    character: ICharacter,
    itemCraftable: ItemCraftable,
    skillIncrease: SkillIncrease
  ): Promise<void> => {
    character.name = "Impacted by effect";
    await character.save();
  },
};
