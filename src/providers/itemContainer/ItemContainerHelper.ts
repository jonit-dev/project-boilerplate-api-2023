import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";

import { Item } from "@entities/ModuleInventory/ItemModel";
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
}
