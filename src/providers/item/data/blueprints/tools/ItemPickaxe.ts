import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { IUseWithItemToTileOptions, UseWithItemToTile } from "@providers/useWith/abstractions/UseWithItemToTile";
import { IItemUseWith, IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { CraftingResourcesBlueprint, RangedWeaponsBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemPickaxe: Partial<IItemUseWith> = {
  key: ToolsBlueprint.Pickaxe,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/pickaxe.png",
  name: "Pickaxe",
  description: "A tool used for mining, breaking rocks or even as a weapon.",
  attack: 4,
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
    const useWithTileToTile = container.get<UseWithItemToTile>(UseWithItemToTile);

    const baseUseWithTileToTileOptions: IUseWithItemToTileOptions = {
      targetTile,
      targetTileAnimationEffectKey: "mining",
      errorMessages: [
        "Hmm... Nothing here.",
        "You effort is in vain.",
        "You can't find anything.",
        "Maybe you should try somewhere else.",
        "Mining is hard work! Nothing here!",
      ],
      successMessages: [
        "You found some ore!",
        "Wow! You got some ore!",
        "You found some ore! You can smelt it into ingot bars.",
      ],
      rewards: [
        {
          key: RangedWeaponsBlueprint.Stone,
          qty: [3, 5],
          chance: 30,
        },
      ],
    };

    let useWithTileToTileOptions: IUseWithItemToTileOptions = baseUseWithTileToTileOptions;

    switch (targetName) {
      case CraftingResourcesBlueprint.IronOre:
        useWithTileToTileOptions = {
          ...baseUseWithTileToTileOptions,
          rewards: [
            ...baseUseWithTileToTileOptions.rewards,
            {
              key: CraftingResourcesBlueprint.IronOre,
              qty: [5, 7],
              chance: 20,
            },
          ],
        };
        break;
      case CraftingResourcesBlueprint.CopperOre:
        useWithTileToTileOptions = {
          ...baseUseWithTileToTileOptions,
          rewards: [
            ...baseUseWithTileToTileOptions.rewards,
            {
              key: CraftingResourcesBlueprint.CopperOre,
              qty: [3, 4],
              chance: 15,
            },
          ],
        };
        break;

      case CraftingResourcesBlueprint.SilverOre:
        useWithTileToTileOptions = {
          ...baseUseWithTileToTileOptions,
          rewards: [
            ...baseUseWithTileToTileOptions.rewards,
            {
              key: CraftingResourcesBlueprint.SilverOre,
              qty: [2, 3],
              chance: 10,
            },
          ],
        };
        break;
      case CraftingResourcesBlueprint.GoldenOre:
        useWithTileToTileOptions = {
          ...baseUseWithTileToTileOptions,
          rewards: [
            ...baseUseWithTileToTileOptions.rewards,
            {
              key: CraftingResourcesBlueprint.GoldenOre,
              qty: [1, 2],
              chance: 7,
            },
          ],
        };
        break;
      case CraftingResourcesBlueprint.GreenOre:
        useWithTileToTileOptions = {
          ...baseUseWithTileToTileOptions,
          rewards: [
            ...baseUseWithTileToTileOptions.rewards,
            {
              key: CraftingResourcesBlueprint.GreenOre,
              qty: [1, 2],
              chance: 50,
            },
          ],
        };
        break;
      case CraftingResourcesBlueprint.ObsidiumOre:
        useWithTileToTileOptions = {
          ...baseUseWithTileToTileOptions,
          rewards: [
            ...baseUseWithTileToTileOptions.rewards,
            {
              key: CraftingResourcesBlueprint.ObsidiumOre,
              qty: [1, 2],
              chance: 3,
            },
          ],
        };
        break;
      case CraftingResourcesBlueprint.CorruptionOre:
        useWithTileToTileOptions = {
          ...baseUseWithTileToTileOptions,
          rewards: [
            ...baseUseWithTileToTileOptions.rewards,
            {
              key: CraftingResourcesBlueprint.CorruptionOre,
              qty: [1, 2],
              chance: 1,
            },
          ],
        };
        break;
    }

    await useWithTileToTile.execute(character, useWithTileToTileOptions);
  },
};
