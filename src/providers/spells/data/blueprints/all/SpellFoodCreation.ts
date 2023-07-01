import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { blueprintManager, container } from "@providers/inversify/container";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { AvailableBlueprints } from "@providers/item/data/types/itemsBlueprintTypes";
import { AnimationEffectKeys, ISpell, ItemSubType, SpellCastingType, SpellsBlueprint } from "@rpg-engine/shared";
import { SpellItemCreation } from "../../abstractions/SpellItemCreation";

export const spellFoodCreation: Partial<ISpell> = {
  key: SpellsBlueprint.FoodCreationSpell,

  name: "Food Creation Spell",
  description: "A spell that creates food item in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar klatha",
  manaCost: 14,
  minLevelRequired: 3,
  minMagicLevelRequired: 3,
  cooldown: 5,
  castingAnimationKey: AnimationEffectKeys.LevelUp,

  usableEffect: async (character: ICharacter) => {
    const spellItemCreation = container.get(SpellItemCreation);

    return await spellItemCreation.createItem(character, {
      itemToCreate: {
        key: await getFoodItemKey(),
      },
    });
  },
};

async function getFoodItemKey(): Promise<string> {
  const foodItems = await getFoodItems();
  const index = Math.floor(Math.random() * foodItems.length);
  const foodItem = foodItems[index];
  return foodItem.key!;
}

async function getFoodItems(): Promise<Partial<IItem>[]> {
  const foods: Partial<IItem>[] = [];
  for (const itemKey in itemsBlueprintIndex) {
    const item = await blueprintManager.getBlueprint<IItem>("items", itemKey as AvailableBlueprints);

    if (item.subType === ItemSubType.Food) {
      foods.push(item);
    }
  }
  return foods;
}
