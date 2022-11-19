import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { IItemUseWithEntity, IUseWithTargetTile, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFishingRod: Partial<IItemUseWithEntity> = {
  key: ToolsBlueprint.FishingRod,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/fishing-rod.png",
  name: "Fishing Rod",
  description: "A tool primarily used to catch fish. It requires a worm as bait to be effective.",
  weight: 0.25,
  hasUseWith: true,
  basePrice: 70,
  useWithEffect: (item: IItem, targetTile: IUseWithTargetTile, character: ICharacter): void => {
    console.log(item, targetTile, character);
  },
};
