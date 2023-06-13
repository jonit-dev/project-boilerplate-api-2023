import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer as IItemContainerModel, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(CharacterInventory)
export class CharacterInventory {
  constructor(private socketMessaging: SocketMessaging, private newRelic: NewRelic) {}

  public async getInventory(character: ICharacter): Promise<IItem | null> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterInventory.getInventory",
      async () => {
        const equipment = (await Equipment.findById(character.equipment).lean().select("inventory")) as IEquipment;

        if (equipment) {
          const inventory = (await Item.findById(equipment.inventory).lean({
            virtuals: true,
            defaults: true,
          })) as IItem;

          if (inventory) {
            return inventory;
          }
        }

        return null; //! some areas of the codebase strictly check for null, so return it instead of undefined
      }
    );
  }

  public async getAllItemsFromContainer(itemContainerId: Types.ObjectId): Promise<IItem[]> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterInventory.getAllItemsFromContainer",

      async () => {
        try {
          const inventory = (await ItemContainer.findById(itemContainerId).lean()) as IItemContainerModel;

          if (!inventory) {
            throw new Error(`Inventory not found for itemContainerId: ${itemContainerId}`);
          }

          const slots = inventory.slots as IItem[];
          const slotsArray = Object.values(slots);

          const itemsPromises = slotsArray
            .filter((slot) => slot !== null)
            .map(async (slot) => {
              return (await Item.findById(slot._id).lean()) as IItem;
            });

          const items = await Promise.all(itemsPromises);
          return items.filter((item): item is IItem => item !== null);
        } catch (error) {
          console.error(error);
          return [];
        }
      }
    );
  }

  /**
   * This function retrieves all items from a character container(inventory), including items that are
   * inside any nested bags.
   *
   */
  public async getAllItemsFromInventory(character: ICharacter): Promise<Record<string, IItem[]> | null> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterInventory.getAllItemsFromInventory",
      async () => {
        const nestedInventoryAndItems: Record<string, IItem[]> = {};

        try {
          const characterInventory = await this.getInventory(character);

          if (!characterInventory || !characterInventory.itemContainer) {
            throw new Error("Character inventory not found");
          }

          const mainInventory = await this.getAllItemsFromContainer(characterInventory.itemContainer);

          if (mainInventory.length === 0) {
            return null;
          }

          await this.getItemsRecursively(characterInventory.itemContainer, nestedInventoryAndItems);

          return nestedInventoryAndItems;
        } catch (err) {
          console.error(err);

          return null;
        }
      }
    );
  }

  async getItemsRecursively(
    inventoryId: Types.ObjectId,
    nestedInventoryAndItems: Record<string, IItem[]>
  ): Promise<void> {
    return await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "CharacterInventory.getItemsRecursively",
      async () => {
        const inventory = await this.getAllItemsFromContainer(inventoryId);

        if (inventory.length > 0) {
          nestedInventoryAndItems[inventoryId.toString()] = inventory;

          const hasContainer = inventory.filter(
            (item) => item.type === "Container" && item.itemContainer !== inventoryId
          );

          if (hasContainer.length > 0) {
            // Map and await all recursive calls
            await Promise.all(
              hasContainer.map((nestedBag) =>
                nestedBag.itemContainer
                  ? this.getItemsRecursively(nestedBag.itemContainer, nestedInventoryAndItems)
                  : Promise.resolve()
              )
            );
          }
        }
      }
    );
  }

  public async generateNewInventory(
    character: ICharacter,
    inventoryType: ContainersBlueprint,
    useExistingEquipment: boolean = false
  ): Promise<IEquipment> {
    let equipment;

    if (!useExistingEquipment) {
      equipment = new Equipment();
    } else {
      equipment = await Equipment.findById(character.equipment);

      if (!equipment) {
        throw new Error("Equipment not found");
      }
    }

    equipment.owner = character._id;

    const containerBlueprint = itemsBlueprintIndex[inventoryType];

    const bag = new Item({
      ...containerBlueprint,
      owner: equipment.owner,
    });
    await bag.save();

    equipment.inventory = bag._id;
    await equipment.save();

    return equipment;
  }

  public async sendInventoryUpdateEvent(character: ICharacter): Promise<void> {
    const inventory = await this.getInventory(character);
    const inventoryContainer = (await ItemContainer.findById(inventory?.itemContainer)) as unknown as IItemContainer;

    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      {
        inventory: inventoryContainer,
        openInventoryOnUpdate: false,
      }
    );
  }
}
