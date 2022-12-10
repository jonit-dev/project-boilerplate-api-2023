import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { AnimationEffectKeys, ItemSubType, SpellCastingType } from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";
import { container } from "@providers/inversify/container";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { CharacterInventory } from "@providers/character/CharacterInventory";

export const spellFoodCreation: Partial<ISpell> = {
  key: SpellsBlueprint.FoodCreationSpell,

  name: "Food Creation Spell",
  description: "A spell that creates food item in your inventory.",

  castingType: SpellCastingType.SelfCasting,
  magicWords: "iquar klatha",
  manaCost: 20,
  minLevelRequired: 2,
  minMagicLevelRequired: 3,
  animationKey: AnimationEffectKeys.LevelUp,

  usableEffect: async (character: ICharacter) => {
    const characterItemInventory = container.get(CharacterItemInventory);
    const characterInventory = container.get(CharacterInventory);

    const added = await characterItemInventory.addItemToInventory(getFoodItemKey(), character);
    if (added) {
      await characterInventory.sendInventoryUpdateEvent(character);
    }
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
