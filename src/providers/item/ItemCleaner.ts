import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";

import { provide } from "inversify-binding-decorators";

@provide(ItemCleaner)
export class ItemCleaner {
  constructor(private characterInventory: CharacterInventory) {}

  public async cleanupMissingReferences(character: ICharacter): Promise<void> {
    const inventory = await this.characterInventory.getInventory(character);

    if (!inventory) {
      return;
    }

    const inventoryContainer = await ItemContainer.findById(inventory?.itemContainer).lean({
      virtuals: true,
      defaults: true,
    });

    if (!inventoryContainer) {
      return;
    }

    const slots = inventoryContainer.slots as Record<string, IItem>;

    for (const slotNumber of Object.keys(slots)) {
      const slotData = slots[slotNumber];
      if (!slotData) {
        continue;
      }
      // check if item exists
      const item = await Item.findById(slotData._id).lean({ virtuals: true, defaults: true });

      if (!item) {
        // remove slot on item container with update one
        delete slots[slotNumber];
      }
    }

    await ItemContainer.updateOne({ _id: inventoryContainer._id }, { slots });
  }
}
