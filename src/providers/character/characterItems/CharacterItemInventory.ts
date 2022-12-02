import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item } from "@entities/ModuleInventory/ItemModel";
import { isSameKey } from "@providers/dataStructures/KeyHelper";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IItem } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterItemSlots } from "./CharacterItemSlots";

@provide(CharacterItemInventory)
export class CharacterItemInventory {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterItemSlots: CharacterItemSlots,
    private mathHelper: MathHelper
  ) {}

  public async decrementItemFromInventory(
    itemKey: string,
    character: ICharacter,
    decrementQty: number
  ): Promise<boolean> {
    const inventory = (await character.inventory) as unknown as IItem;

    let inventoryItemContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventoryItemContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! Inventory container not found.");
      return false;
    }

    for (let i = 0; i < inventoryItemContainer.slotQty; i++) {
      if (decrementQty <= 0) break;

      const slotItem = inventoryItemContainer.slots[i] as unknown as IItem;
      if (!slotItem) continue;

      let result = true;

      if (isSameKey(slotItem.key, itemKey)) {
        if (slotItem.maxStackSize > 1) {
          // if its stackable, decrement the stack

          let remaining = 0;

          if (decrementQty <= slotItem.stackQty!) {
            remaining = this.mathHelper.fixPrecision(slotItem.stackQty! - decrementQty);
            decrementQty = 0;
          } else {
            decrementQty = this.mathHelper.fixPrecision(decrementQty - slotItem.stackQty!);
          }

          if (remaining > 0) {
            await this.characterItemSlots.updateItemOnSlot(i, inventoryItemContainer, {
              ...slotItem,
              stackQty: remaining,
            });
          } else {
            result = await this.deleteItemFromInventory(slotItem._id, character);

            // we need to fetch updated container in case some quantity remains to be substracted
            if (result && decrementQty > 0) {
              inventoryItemContainer = await ItemContainer.findById(inventory?.itemContainer);
              if (!inventoryItemContainer) {
                result = false;
                break;
              }
            }
          }
        } else {
          // if its not stackable, just remove it
          result = await this.deleteItemFromInventory(slotItem._id, character);
          decrementQty--;
        }
      }

      if (!result) {
        return false;
      }
    }

    return true;
  }

  public async deleteItemFromInventory(itemId: string, character: ICharacter): Promise<boolean> {
    const doesCharacterHaveItemInInventory = await this.checkItemInInventory(itemId, character);

    if (!doesCharacterHaveItemInInventory) {
      this.socketMessaging.sendErrorMessageToCharacter(
        character,
        "Oops! The character does not have the item to be deleted on the inventory."
      );
      return false;
    }

    const item = await Item.findById(itemId);

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The item to be deleted was not found.");
      return false;
    }

    return await this.removeItemFromInventory(item._id, character);
  }

  /**
   * Returns the item id if it finds it. Otherwise, returns undefined
   */
  public async checkItemInInventoryByKey(itemKey: string, character: ICharacter): Promise<string | undefined> {
    const inventory = (await character.inventory) as unknown as IItem;

    const inventoryItemContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventoryItemContainer) {
      return;
    }

    for (let i = 0; i < inventoryItemContainer.slotQty; i++) {
      let slotItem = inventoryItemContainer.slots[i] as unknown as IItem;
      if (!slotItem) continue;

      if (!slotItem.key) {
        slotItem = (await Item.findById(slotItem as any)) as unknown as IItem;
      }

      if (isSameKey(slotItem.key, itemKey)) {
        return slotItem._id;
      }
    }
  }

  public async checkItemInInventory(itemId: string, character: ICharacter): Promise<boolean> {
    const inventory = (await character.inventory) as unknown as IItem;

    const inventoryItemContainer = await ItemContainer.findById(inventory?.itemContainer);

    if (!inventoryItemContainer) {
      return false;
    }

    const inventoryItemIds = inventoryItemContainer?.itemIds;

    if (!inventoryItemIds) {
      return false;
    }
    // @ts-ignore
    return !!inventoryItemIds.find((id) => id.toString("hex") === itemId.toString("hex"));
  }

  private async removeItemFromInventory(itemId: string, character: ICharacter): Promise<boolean> {
    const item = (await Item.findById(itemId)) as unknown as IItem;

    if (!item) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The item to be removed was not found.");
      return false;
    }

    const inventory = (await character.inventory) as unknown as IItem;

    if (!inventory) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The character does not have an inventory.");
      return false;
    }

    const inventoryItemContainer = await ItemContainer.findById(inventory.itemContainer);

    if (!inventoryItemContainer) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "Oops! The character does not have an inventory.");
      return false;
    }

    for (let i = 0; i < inventoryItemContainer.slotQty; i++) {
      const slotItem = inventoryItemContainer.slots?.[i];

      if (!slotItem) continue;
      if (slotItem._id.toString() === item._id.toString()) {
        // Changing item slot to null, thus removing it
        inventoryItemContainer.slots[i] = null;

        await ItemContainer.updateOne(
          {
            _id: inventoryItemContainer._id,
          },
          {
            $set: {
              slots: {
                ...inventoryItemContainer.slots,
              },
            },
          }
        );

        return true;
      }
    }

    this.socketMessaging.sendErrorMessageToCharacter(
      character,
      "Oops! Something went wrong while trying to remove the item from the inventory."
    );

    return false;
  }

  public async addEquipmentToCharacter(character: ICharacter): Promise<void> {
    const equipment = await this.createEquipmentWithInventory(character);

    character.equipment = equipment._id;
    await character.save();
  }

  public async createEquipmentWithInventory(character: ICharacter): Promise<IEquipment> {
    const equipment = new Equipment();
    equipment.owner = character._id;

    const blueprintData = itemsBlueprintIndex[ContainersBlueprint.Backpack];

    const backpack = new Item({
      ...blueprintData,
      owner: equipment.owner,
    });
    await backpack.save();

    equipment.inventory = backpack._id;
    await equipment.save();

    return equipment;
  }
}
