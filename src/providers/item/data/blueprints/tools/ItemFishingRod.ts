import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { ItemCraftable } from "@providers/item/ItemCraftable";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { UseWithItemToTile } from "@providers/useWith/abstractions/UseWithItemToTile";
import { IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import {
  AnimationEffectKeys,
  EntityAttackType,
  IToolItemBlueprint,
  ItemRarities,
  ItemSlotType,
  ItemSubType,
  ItemType,
  RangeTypes,
} from "@rpg-engine/shared";
import { CraftingResourcesBlueprint, FoodsBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemFishingRod: IToolItemBlueprint = {
  key: ToolsBlueprint.FishingRod,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/fishing-rod.png",
  name: "Fishing Rod",
  description: "A tool primarily used to catch fish. It requires a worm as bait to be effective.",
  weight: 0.1,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  hasUseWith: true,
  basePrice: 70,
  rangeType: EntityAttackType.Melee,
  useWithMaxDistanceGrid: RangeTypes.Medium,
  canSell: false,
  useWithTileEffect: async (
    originItem: IItem,
    targetTile: IUseWithTargetTile,
    targetName: string,
    character: ICharacter,
    itemCraftable: ItemCraftable,
    skillIncrease: SkillIncrease
  ): Promise<void> => {
    const useWithItemToTile = container.get<UseWithItemToTile>(UseWithItemToTile);
    const rarityOfTool = originItem.rarity ?? ItemRarities.Common;

    await useWithItemToTile.execute(
      character,
      {
        targetTile,
        requiredResource: {
          key: CraftingResourcesBlueprint.Worm,
          decrementQty: 1,
          errorMessage: "Sorry, you need a worm to fish.",
        },
        targetTileAnimationEffectKey: "fishing",

        successAnimationEffectKey: AnimationEffectKeys.LevelUp,
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
            chance: await itemCraftable.getCraftChance(character, 2.5, rarityOfTool),
          },
          {
            key: FoodsBlueprint.Tuna,
            qty: [2, 3],
            chance: await itemCraftable.getCraftChance(character, 10, rarityOfTool),
          },
          {
            key: FoodsBlueprint.BrownFish,
            qty: [1, 2],
            chance: await itemCraftable.getCraftChance(character, 10, rarityOfTool),
          },
        ],
      },
      skillIncrease
    );
  },
  usableEffectDescription: "Use it on a fishing spot with a worm to catch a fish",
};
