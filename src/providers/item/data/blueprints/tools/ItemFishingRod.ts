import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { UseWithFishingRod } from "@providers/useWith/items/UseWithFishingRod";
import { IItemUseWith, IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFishingRod: Partial<IItemUseWith> = {
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
  useWithMaxDistanceGrid: 7,
  useWithTileEffect: async (
    originItem: IItem,
    targetTile: IUseWithTargetTile,
    character: ICharacter
  ): Promise<void> => {
    const useWithFishingRod = container.get<UseWithFishingRod>(UseWithFishingRod);

    await useWithFishingRod.execute(character, targetTile);
  },
};
