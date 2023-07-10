import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";

import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { provide } from "inversify-binding-decorators";
import { ItemOwnership } from "./ItemOwnership";
import { ItemWeightTracker } from "./ItemWeightTracker";

@provide(ItemCleaner)
export class ItemCleaner {
  constructor(
    private characterInventory: CharacterInventory,
    private equipmentSlots: EquipmentSlots,
    private itemOwnership: ItemOwnership,
    private itemWeightTracker: ItemWeightTracker
  ) {}

  public async clearMissingReferences(character: ICharacter): Promise<void> {
    await this.cleanupMissingEquipmentReferences(character);
    await this.cleanupMissingInventoryReferences(character);
  }

  @TrackNewRelicTransaction()
  private async cleanupMissingEquipmentReferences(character: ICharacter): Promise<void> {
    if (!character.equipment) {
      return;
    }

    const slotsData = await this.equipmentSlots.getEquipmentSlots(character._id, character.equipment.toString());

    for (const [slotName, itemData] of Object.entries(slotsData)) {
      if (!itemData || slotName === "_id") {
        continue;
      }

      const item = (await Item.findById(itemData._id).lean({ virtuals: true, defaults: true })) as IItem;

      if (item && !item?.owner) {
        await this.itemOwnership.addItemOwnership(item, character._id);
      }

      if (item && !item?.carrier) {
        await this.itemWeightTracker.setItemWeightTracking(item, character._id);
      }

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

  @TrackNewRelicTransaction()
  private async cleanupMissingInventoryReferences(character: ICharacter): Promise<void> {
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
      const item = (await Item.findById(slotData._id).lean({ virtuals: true, defaults: true })) as IItem;

      if (item && !item?.owner) {
        await this.itemOwnership.addItemOwnership(item, character._id);
      }

      if (item && !item?.carrier) {
        await this.itemWeightTracker.setItemWeightTracking(item, character._id);
      }

      if (!item) {
        // remove slot on item container with update one
        delete slots[slotNumber];
      }
    }

    await ItemContainer.updateOne({ _id: inventoryContainer._id }, { slots });
  }
}
