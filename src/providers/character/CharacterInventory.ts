import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment, IEquipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { ContainersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(CharacterInventory)
export class CharacterInventory {
  constructor(private socketMessaging: SocketMessaging) {}

  public async getInventory(character: ICharacter): Promise<IItem | null> {
    const equipment = await Equipment.findById(character.equipment).lean();

    if (equipment) {
      const inventory = await Item.findById(equipment.inventory);

      if (inventory) {
        return inventory;
      }
    }

    return null; //! some areas of the codebase strictly check for null, so return it instead of undefined
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
