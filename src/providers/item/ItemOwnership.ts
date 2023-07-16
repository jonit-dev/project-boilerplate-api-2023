import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterItemSlots } from "@providers/character/characterItems/CharacterItemSlots";
import { provide } from "inversify-binding-decorators";

@provide(ItemOwnership)
export class ItemOwnership {
  constructor(private characterItemSlot: CharacterItemSlots) {}

  @TrackNewRelicTransaction()
  public async addItemOwnership(item: IItem, character: ICharacter): Promise<void> {
    // if our item owner is our character, just skip. Nothing to do here.
    if (item.owner?.toString() === character._id.toString()) {
      return;
    }

    await Item.updateOne({ _id: item._id }, { owner: character._id });

    if (item?.itemContainer) {
      // adds ownership for the container itself
      await ItemContainer.updateOne(
        {
          _id: item.itemContainer,
        },
        { owner: character._id }
      );

      // and for all nested items

      await this.addOwnershipToAllItemsInContainer(
        item.itemContainer as unknown as string,
        character._id as unknown as string
      );
    }
  }

  @TrackNewRelicTransaction()
  public async removeItemOwnership(item: IItem): Promise<boolean> {
    try {
      await Item.updateOne(
        {
          _id: item._id,
        },
        {
          $unset: { owner: "" },
        }
      );

      if (item?.itemContainer) {
        const itemContainer = await ItemContainer.findById(item.itemContainer);

        if (!itemContainer) {
          throw new Error("ItemOwnership: Item container not found");
        }

        // this remover ownership from the container itself
        await ItemContainer.updateOne(
          {
            _id: item.itemContainer,
          },
          { $unset: { owner: "" } }
        );

        // this removes from all nested items
        await this.removeOwnershipFromAllItemsInContainer(itemContainer._id as unknown as string);
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  @TrackNewRelicTransaction()
  public async addOwnershipToAllItemsInContainer(itemContainerId: string, owner: string): Promise<void> {
    const itemContainer = await ItemContainer.findById(itemContainerId);

    if (!itemContainer) {
      throw new Error("ItemOwnership: Item container not found");
    }

    await this.loopThroughAllItemsInContainerAndCallback(itemContainer, async (item, slotIndex) => {
      if (item.itemContainer) {
        await this.addItemOwnership(item, { _id: owner } as unknown as ICharacter);
      } else {
        await Item.updateOne(
          {
            _id: item._id,
          },
          {
            owner,
          }
        );
      }

      await this.characterItemSlot.updateItemOnSlot(slotIndex, itemContainer, {
        owner,
      });
    });
  }

  public async removeOwnershipFromAllItemsInContainer(itemContainerId: string): Promise<void> {
    const itemContainer = (await ItemContainer.findById(itemContainerId).lean().select("slots")) as IItemContainer;

    if (!itemContainer) {
      throw new Error("ItemOwnership: Item container not found");
    }

    let depth = 0;
    const maxDepth = 100;
    await this.loopThroughAllItemsInContainerAndCallback(itemContainer, async (item, slotIndex) => {
      const hasItem = await Item.exists({ _id: item._id });

      if (!hasItem) {
        return;
      }

      if (itemContainer._id === item.itemContainer) {
        return;
      }

      if (item.itemContainer) {
        depth++;

        if (depth > maxDepth) {
          throw new Error("ItemOwnership: Max depth reached");
        }
      }

      const success = await this.removeItemOwnership(item);

      if (success) {
        await this.characterItemSlot.updateItemOnSlot(slotIndex, itemContainer, {
          owner: undefined,
        });
      }
    });
  }

  @TrackNewRelicTransaction()
  private async loopThroughAllItemsInContainerAndCallback(
    itemContainer: IItemContainer,
    fn: (item: IItem, slotIndex: number) => Promise<void>
  ): Promise<void> {
    const slots = itemContainer.slots;

    for (const [slotIndex, itemData] of Object.entries(slots)) {
      const item = itemData as IItem;

      if (item) {
        await fn(item, Number(slotIndex));
      }
    }
  }
}
