import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";

import { provide } from "inversify-binding-decorators";
import { ItemOwnership } from "./ItemOwnership";

@provide(ItemCleaner)
export class ItemCleaner {
  constructor(
    private characterInventory: CharacterInventory,
    private equipmentSlots: EquipmentSlots,
    private newRelic: NewRelic,
    private itemOwnership: ItemOwnership
  ) {}

  public async clearMissingReferences(character: ICharacter): Promise<void> {
    await this.cleanupMissingEquipmentReferences(character);
    await this.cleanupMissingInventoryReferences(character);
  }

  private async cleanupMissingEquipmentReferences(character: ICharacter): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "ItemCleaner.cleanupMissingEquipmentReferences",
      async () => {
        if (!character.equipment) {
          return;
        }

        const slotsData = await this.equipmentSlots.getEquipmentSlots(character.equipment.toString());

        for (const [slotName, itemData] of Object.entries(slotsData)) {
          if (!itemData || slotName === "_id") {
            continue;
          }

          const item = await Item.findById(itemData._id).lean({ virtuals: true, defaults: true });

          if (!item) {
            await Equipment.updateOne(
              { _id: character.equipment.toString() },
              {
                $unset: {
                  [slotName]: "",
                },
              }
            );
          }
        }
      }
    );
  }

  private async cleanupMissingInventoryReferences(character: ICharacter): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "ItemCleaner.cleanupMissingInventoryReferences",
      async () => {
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

          if (!item?.owner) {
            await this.itemOwnership.addItemOwnership(item as IItem, character);
          }
        }

        await ItemContainer.updateOne({ _id: inventoryContainer._id }, { slots });
      }
    );
  }
}
