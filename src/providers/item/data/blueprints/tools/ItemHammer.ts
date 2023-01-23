import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import {
  IUseWithItemToTileOptions,
  IUseWithItemToTileReward,
  UseWithItemToTile,
} from "@providers/useWith/abstractions/UseWithItemToTile";
import { IItemUseWith, IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { CraftingResourcesBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHammer: Partial<IItemUseWith> = {
  key: ToolsBlueprint.Hammer,
  type: ItemType.Tool,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "hammers/hammer.png",
  name: "Blacksmith's Hammer",
  description: "A simple hammer used as a weapon or for blacksmithing.",
  attack: 5,
  defense: 2,
  weight: 2,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
  hasUseWith: true,
  useWithMaxDistanceGrid: 2,
  useWithTileEffect: async (
    originItem: IItem,
    targetTile: IUseWithTargetTile,
    targetName: string | undefined,
    character: ICharacter
  ) => {
    const useWithItemToTile = container.get<UseWithItemToTile>(UseWithItemToTile);
    const rewards = new Map<string, IUseWithItemToTileReward[]>([
      [
        CraftingResourcesBlueprint.IronOre,
        [
          {
            key: CraftingResourcesBlueprint.IronIngot,
            qty: [2, 5],
            chance: 60,
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.CopperOre,
        [
          {
            key: CraftingResourcesBlueprint.CopperIngot,
            qty: [2, 5],
            chance: 70,
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.GoldenOre,
        [
          {
            key: CraftingResourcesBlueprint.GoldenIngot,
            qty: [2, 5],
            chance: 40,
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.SilverOre,
        [
          {
            key: CraftingResourcesBlueprint.SilverIngot,
            qty: [2, 5],
            chance: 50,
          },
        ],
      ],
    ]);
    const options: IUseWithItemToTileOptions = {
      targetTile,
      requiredResource: {
        key: [
          CraftingResourcesBlueprint.IronOre,
          CraftingResourcesBlueprint.CopperOre,
          CraftingResourcesBlueprint.GoldenOre,
          CraftingResourcesBlueprint.SilverOre,
        ],
        decrementQty: 10,
        errorMessage: "Sorry, you need some more ore to forge an ingot.",
      },
      targetTileAnimationEffectKey: "block",
      errorMessages: [
        "Hmm... Nothing here.",
        "You effort is in vain.",
        "You can't do anything here with that.",
        "Maybe you should try somewhere else.",
        "The business of a blacksmith is hard work! Nothing here!",
      ],
      successMessages: ["You forged some ingots!", "Wow! You got some ingots!"],
      rewards,
    };

    await useWithItemToTile.execute(character, options);
  },
};
