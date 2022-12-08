import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { IBlueprint } from "@providers/types/temp/BlueprintTypes";
import {
  AnimationEffectKeys,
  IEquipmentAndInventoryUpdatePayload,
  IItemContainer,
  ItemSocketEvents,
  ItemSubType,
  SpellCastingType,
} from "@rpg-engine/shared";
import { ISpell, SpellsBlueprint } from "../types/SpellsBlueprintTypes";
import { container } from "@providers/inversify/container";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";

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
    const characterItemsContainer = container.get(CharacterItemContainer);

    const inventory = await character.inventory;
    const inventoryContainerId = inventory?.itemContainer as unknown as string;

    const item = getFoodItem();
    await item.save();

    await characterItemsContainer.addItemToContainer(item, character, inventoryContainerId);

    await sendItemsUpdateEvent(inventory, character);
  },
};

function getFoodItem(): IItem {
  const foodItems = getFoodItems();
  const index = Math.floor(Math.random() * foodItems.length);
  const foodItem = foodItems[index];

  const item = new Item({ ...foodItem });
  if (item.maxStackSize > 1) {
    item.stackQty = 1;
  }

  return item;
}

function getFoodItems(): IBlueprint[] {
  const foods: IBlueprint[] = [];
  for (const itemKey in itemsBlueprintIndex) {
    const item = itemsBlueprintIndex[itemKey];
    if (item.subType === ItemSubType.Food) {
      foods.push(item);
    }
  }
  return foods;
}

async function sendItemsUpdateEvent(inventory: IItem, character: ICharacter): Promise<void> {
  const socketMessaging = container.get(SocketMessaging);

  const inventoryContainer = (await ItemContainer.findById(inventory.itemContainer)) as unknown as IItemContainer;

  socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
    character.channelId!,
    ItemSocketEvents.EquipmentAndInventoryUpdate,
    {
      inventory: inventoryContainer,
      openInventoryOnUpdate: false,
    }
  );
}
