import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { recipeBlueprintsIndex } from "@providers/useWith/recipes";
import { IUseWithCraftingRecipe } from "@providers/useWith/useWithTypes";
import { CraftingSkill } from "@rpg-engine/shared";

import { provide } from "inversify-binding-decorators";

@provide(ItemCraftingRecipes)
export class ItemCraftingRecipes {
  constructor(private characterItemInventory: CharacterItemInventory) {}

  @TrackNewRelicTransaction()
  public async getCharacterInventoryIngredients(character: ICharacter): Promise<Map<string, number>> {
    const items = await this.characterItemInventory.getAllItemsFromInventoryNested(character);

    if (!items) {
      return new Map<string, number>();
    }

    const ingredientMap = new Map<string, number>();

    for (const item of items) {
      if (item.stackQty) {
        ingredientMap.set(item.key, item.stackQty + (ingredientMap.get(item.key) ?? 0));
      } else {
        ingredientMap.set(item.key, (ingredientMap.get(item.key) ?? 0) + 1);
      }
    }

    return ingredientMap;
  }

  public getAllRecipes(): Object {
    const obj = {};
    for (const itemKey in recipeBlueprintsIndex) {
      for (const recipe of recipeBlueprintsIndex[itemKey]) {
        obj[recipe.outputKey] = recipe;
      }
    }
    return obj;
  }

  public canCraftRecipe(inventoryInfo: Map<string, number>, recipe: IUseWithCraftingRecipe): boolean {
    return recipe.requiredItems.every((ing) => {
      const availableQty = inventoryInfo.get(ing.key) ?? 0;

      return availableQty >= ing.qty;
    });
  }

  public haveMinimumSkills(skills: ISkill, recipe: IUseWithCraftingRecipe): boolean {
    // Retrieve the minimum crafting requirements from the recipe
    const minCraftingRequirements = recipe.minCraftingRequirements;

    // Determine the character's skill level for the required crafting skill
    let skillLevel: number = 0;
    switch (minCraftingRequirements[0]) {
      case CraftingSkill.Blacksmithing:
        skillLevel = skills.blacksmithing.level;
        break;
      case CraftingSkill.Lumberjacking:
        skillLevel = skills.lumberjacking.level;
        break;
      case CraftingSkill.Alchemy:
        skillLevel = skills.alchemy.level;
        break;
      case CraftingSkill.Mining:
        skillLevel = skills.mining.level;
        break;
      case CraftingSkill.Cooking:
        skillLevel = skills.cooking.level;
        break;
      case CraftingSkill.Fishing:
        skillLevel = skills.fishing.level;
        break;
      default:
        break;
    }

    // Check if the character's skill level meets the minimum crafting requirements
    if (skillLevel < minCraftingRequirements[1]) {
      return false;
    }

    // If all checks pass, return true
    return true;
  }
}
