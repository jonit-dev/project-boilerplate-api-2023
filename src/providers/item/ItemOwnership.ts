import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { provide } from "inversify-binding-decorators";

@provide(ItemOwnership)
export class ItemOwnership {
  public async addItemOwnership(item: IItem, character: ICharacter): Promise<void> {
    await Item.updateOne({ _id: item._id }, { $set: { owner: character._id } });

    if (item?.itemContainer) {
      await ItemContainer.updateOne(
        {
          _id: item.itemContainer,
        },
        { $set: { owner: character._id } }
      );
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
