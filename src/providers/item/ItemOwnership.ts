import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { provide } from "inversify-binding-decorators";

@provide(ItemOwnership)
export class ItemOwnership {
  public async addItemOwnership(item: IItem, character: ICharacter): Promise<void> {
    const updatedItem = await Item.findByIdAndUpdate(item._id, { owner: character._id });

    if (updatedItem?.itemContainer) {
      await ItemContainer.findByIdAndUpdate(updatedItem.itemContainer, { owner: character._id });
    }
  }

  public async removeItemOwnership(item: IItem): Promise<void> {
    const updatedItem = await Item.findByIdAndUpdate(item._id, {
      owner: undefined,
    });

    if (updatedItem?.itemContainer) {
      await ItemContainer.findByIdAndUpdate(updatedItem.itemContainer, { owner: undefined });
    }
  }
}
