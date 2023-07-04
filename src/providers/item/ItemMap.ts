import { IItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { provide } from "inversify-binding-decorators";

@provide(ItemMap)
export class ItemMap {
  constructor(private characterItemSlots: CharacterItemSlots) {}

  public async clearItemCoordinates(item: IItem, targetContainer: IItemContainer): Promise<void> {
    // clear on the database
    item.x = undefined;
    item.y = undefined;
    item.scene = undefined;
    item.droppedBy = undefined;
    (await Item.findByIdAndUpdate(item._id, item).lean()) as IItem;

    const itemSlotIndex = await this.characterItemSlots.findItemSlotIndex(targetContainer, item._id);

    if (itemSlotIndex) {
      // update item on slot index, remove x, y, scene
      await this.characterItemSlots.updateItemOnSlot(itemSlotIndex, targetContainer, {
        x: undefined,
        y: undefined,
        scene: undefined,
        droppedBy: undefined,
      });
    }
  }
}
