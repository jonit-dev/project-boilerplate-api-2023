import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { ItemCraftable } from "@providers/item/ItemCraftable";
import { SkillIncrease } from "@providers/skill/SkillIncrease";
import { UseWithItemToTile } from "@providers/useWith/abstractions/UseWithItemToTile";
import { IItemUseWith, IUseWithTargetTile } from "@providers/useWith/useWithTypes";
import { ItemSlotType, ItemSubType, ItemType } from "@rpg-engine/shared";
import { EntityAttackType } from "@rpg-engine/shared/dist/types/entity.types";
import { CraftingResourcesBlueprint, ToolsBlueprint } from "../../types/itemsBlueprintTypes";

export const itemCarpentersAxe: Partial<IItemUseWith> = {
  key: ToolsBlueprint.CarpentersAxe,
  type: ItemType.Tool,
  subType: ItemSubType.Tool,
  textureAtlas: "items",
  texturePath: "tools/carpenters-axe.png",
  name: "Carpenter's Axe",
  description: "An axe designed primarily as a work axe.",
  attack: 6,
  defense: 2,
  weight: 0.5,
  allowedEquipSlotType: [ItemSlotType.LeftHand, ItemSlotType.RightHand],
  rangeType: EntityAttackType.Melee,
  basePrice: 50,
  hasUseWith: true,
  useWithMaxDistanceGrid: 2,
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

    await useWithItemToTile.execute(
      character,
      {
        targetTile,
        targetTileAnimationEffectKey: "cutting-wood",
        errorMessages: ["Hmm... Nothing here.", "Maybe you should try somewhere else.", "You can't find anything."],
        successMessages: ["You found some wood!", "You're getting good at this!"],
        rewards: [
          {
            key: CraftingResourcesBlueprint.GreaterWoodenLog,
            qty: [3, 4],
            chance: await itemCraftable.getCraftChance(character, 30),
          },
          {
            key: CraftingResourcesBlueprint.WoodenSticks,
            qty: [2, 3],
            chance: await itemCraftable.getCraftChance(character, 10),
          },
          {
            key: CraftingResourcesBlueprint.SmallWoodenStick,
            qty: [2, 3],
            chance: await itemCraftable.getCraftChance(character, 10),
          },
          {
            key: CraftingResourcesBlueprint.ElvenWood,
            qty: [1, 2],
            chance: await itemCraftable.getCraftChance(character, 5),
          },
        ],
      },
      skillIncrease
    );
  },
};
