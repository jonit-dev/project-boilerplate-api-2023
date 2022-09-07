import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { IItemContainer, ItemContainerType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(ItemContainerHelper)
export class ItemContainerHelper {
  public async getType(itemContainer: IItemContainer): Promise<ItemContainerType | undefined> {
    try {
      const item = await Item.findById(itemContainer.parentItem);
      if (!item) {
        throw new Error("Failed to get item type: item not found");
      }

      if (item.name.includes("body")) {
        return ItemContainerType.Loot;
      }

      const owner = (await Character.findById(item.owner)) as unknown as ICharacter;
      const inventory = await owner?.inventory;

      if (item.id.toString() === inventory.id.toString()) {
        return ItemContainerType.Inventory;
      }

      if (item.x && item.y && item.scene) {
        return ItemContainerType.MapContainer;
      }
    } catch (error) {
      console.error(error);
    }
  }
}
