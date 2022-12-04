import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { UseWithItemToTile } from "@providers/useWith/abstractions/UseWithItemToTile";
import { IItemUseWith, IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import { ItemSubType, ItemType } from "@rpg-engine/shared";
import { CraftingResourcesBlueprint, FoodsBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

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
    targetName: string,
    character: ICharacter
  ): Promise<void> => {
    const useWithItemToTile = container.get<UseWithItemToTile>(UseWithItemToTile);

    await useWithItemToTile.execute(character, {
      targetTile,
      requiredResource: {
        key: CraftingResourcesBlueprint.Worm,
        decrementQty: 1,
        errorMessage: "Sorry, you need a worm to fish.",
      },
      targetTileAnimationEffectKey: "fishing",

      successAnimationEffectKey: "level_up",
      errorAnimationEffectKey: "miss",
      errorMessages: [
        "Hmm... Nothing here.",
        "You didn't catch anything.",
        "You didn't catch anything. Try again.",
        "Oops! The fish got away.",
        "Erm... Nothing!",
      ],
      successMessages: [
        "You caught a fish!",
        "You caught a big one!",
        "You're getting good at this!",
        "Woooaah! You caught a big fish!",
      ],

      rewards: [
        {
          key: FoodsBlueprint.WildSalmon,
          qty: [1, 3],
          chance: 10,
        },
        {
          key: FoodsBlueprint.Tuna,
          qty: [2, 3],
          chance: 25,
        },
        {
          key: FoodsBlueprint.BrownFish,
          qty: [1, 2],
          chance: 25,
        },
      ],
    });
  },
};
