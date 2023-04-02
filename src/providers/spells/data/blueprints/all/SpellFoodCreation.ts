import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { container } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { AnimationEffectKeys, ItemSubType, SpellCastingType } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";
import { ISpell, SpellsBlueprint } from "../../types/SpellsBlueprintTypes";

export const spellFoodCreation: Partial<ISpell> = {
  key: SpellsBlueprint.FoodCreationSpell,

  name: "Food Creation Spell",
  description: "A spell that creates food item in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar klatha",
  manaCost: 14,
  minLevelRequired: 3,
  minMagicLevelRequired: 3,
  animationKey: AnimationEffectKeys.LevelUp,

  usableEffect: async (character: ICharacter) => {
    const spellItemCreation = container.get(SpellItemCreation);

    return await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: getFoodItemKey(),
      },
    });
  },
};

function getFoodItemKey(): string {
  const foodItems = getFoodItems();
  const index = Math.floor(Math.random() * foodItems.length);
  const foodItem = foodItems[index];
  return foodItem.key!;
}

function getFoodItems(): Partial<IItem>[] {
  const foods: Partial<IItem>[] = [];
  for (const itemKey in itemsBlueprintIndex) {
    const item = itemsBlueprintIndex[itemKey];
    if (item.subType === ItemSubType.Food) {
      foods.push(item);
    }
  }
  return foods;
}
