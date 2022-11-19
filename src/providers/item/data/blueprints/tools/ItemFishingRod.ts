import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { IItemUseWithEntity, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

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
  useWithEffect: (targetItem: IItem, originItem: IItem, character: ICharacter): void => {
    console.log("Use with effect triggered with the following data:");
    console.log("targetItem", targetItem);
    console.log("originItem", originItem);
    console.log("character", character);
  },
};
