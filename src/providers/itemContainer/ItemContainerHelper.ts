import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";

import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { IItemContainer, ItemContainerType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemContainerHelper)
export class ItemContainerHelper {
  constructor(private characterInventory: CharacterInventory) {}

  @TrackNewRelicTransaction()
  public async getContainerType(itemContainer: IItemContainer): Promise<ItemContainerType | undefined> {
    try {
      const item = await Item.findById(itemContainer.parentItem).lean();

      if (!item) {
        throw new Error("Failed to get item type: item not found");
      }

      if (item.name.includes("body")) {
        return ItemContainerType.Loot;
      }

      if (item.x && item.y && item.scene) {
        return ItemContainerType.MapContainer;
      }

      const owner = (await Character.findById(item.owner)) as unknown as ICharacter;
      const inventory = await this.characterInventory.getInventory(owner);

      if (item?._id.toString() === inventory?._id.toString()) {
        return ItemContainerType.Inventory;
      }

      return ItemContainerType.Loot; // last resort, lets consider its a loot container
    } catch (error) {
      console.error(error);
    }
  }

  @TrackNewRelicTransaction()
  public async execFnInAllItemContainerSlots(
    itemContainer: IItemContainer,
    fn: (item: IItem, slotIndex: number) => Promise<void>
  ): Promise<void> {
    const slots = itemContainer.slots;

    const loopedItems = new Set<string>();

    for (const [slotIndex, itemData] of Object.entries(slots)) {
      if (loopedItems.has(itemData?._id)) {
        continue;
      }

      loopedItems.add(itemData?._id);

      const item = itemData as IItem;

      if (item) {
        await fn(item, Number(slotIndex));
      }
    }
  }
}
