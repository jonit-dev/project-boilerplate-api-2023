import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { ItemCraftable } from "@providers/item/ItemCraftable";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import {
  IUseWithItemToTileOptions,
  IUseWithItemToTileReward,
  UseWithItemToTile,
} from "@providers/useWith/abstractions/UseWithItemToTile";
import { IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import { IToolItemBlueprint, ItemSlotType, ItemSubType, ItemType, RangeTypes } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { CraftingResourcesBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemHammer: IToolItemBlueprint = {
  key: ToolsBlueprint.Hammer,
  type: ItemType.Tool,
  subType: ItemSubType.Other,
  textureAtlas: "items",
  texturePath: "hammers/hammer.png",
  name: "Blacksmith's Hammer",
  description: "A simple hammer used as a weapon or for blacksmithing.",
  attack: 5,
  defense: 2,
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 60,
  hasUseWith: true,
  canSell: false,
  useWithMaxDistanceGrid: RangeTypes.UltraShort,
  useWithTileEffect: async (
    originItem: IItem,
    targetTile: IUseWithTargetTile,
    targetName: string | undefined,
    character: ICharacter,
    itemCraftable: ItemCraftable,
    skillIncrease: SkillIncrease
  ) => {
    const useWithItemToTile = container.get<UseWithItemToTile>(UseWithItemToTile);
    const rewards = new Map<string, IUseWithItemToTileReward[]>([
      [
        CraftingResourcesBlueprint.IronOre,
        [
          {
            key: CraftingResourcesBlueprint.IronIngot,
            qty: [2, 4],
            chance: await itemCraftable.getCraftChance(character, 65),
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.CopperOre,
        [
          {
            key: CraftingResourcesBlueprint.CopperIngot,
            qty: [2, 4],
            chance: await itemCraftable.getCraftChance(character, 60),
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.SilverOre,
        [
          {
            key: CraftingResourcesBlueprint.SilverIngot,
            qty: [2, 4],
            chance: await itemCraftable.getCraftChance(character, 55),
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.GoldenOre,
        [
          {
            key: CraftingResourcesBlueprint.GoldenIngot,
            qty: [2, 4],
            chance: await itemCraftable.getCraftChance(character, 50),
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.GreenOre,
        [
          {
            key: CraftingResourcesBlueprint.GreenIngot,
            qty: [2, 4],
            chance: await itemCraftable.getCraftChance(character, 45),
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.ObsidiumOre,
        [
          {
            key: CraftingResourcesBlueprint.ObsidiumIngot,
            qty: [2, 4],
            chance: await itemCraftable.getCraftChance(character, 45),
          },
        ],
      ],
      [
        CraftingResourcesBlueprint.CorruptionOre,
        [
          {
            key: CraftingResourcesBlueprint.CorruptionIngot,
            qty: [2, 4],
            chance: await itemCraftable.getCraftChance(character, 45),
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
          CraftingResourcesBlueprint.GreenOre,
          CraftingResourcesBlueprint.CorruptionOre,
          CraftingResourcesBlueprint.ObsidiumOre,
        ],
        decrementQty: 5,
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

    await useWithItemToTile.execute(character, options, skillIncrease);
  },
  usableEffectDescription: "Use it on an anvil with ore to forge an ingot",
};
