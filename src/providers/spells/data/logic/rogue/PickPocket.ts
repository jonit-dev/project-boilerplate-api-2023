import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterInventory } from "@providers/character/CharacterInventory";
import { CharacterItemContainer } from "@providers/character/characterItems/CharacterItemContainer";
import { CharacterItemInventory } from "@providers/character/characterItems/CharacterItemInventory";
import { CharacterWeight } from "@providers/character/weight/CharacterWeight";
import { blueprintManager } from "@providers/inversify/container";
import { AvailableBlueprints } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IEquipmentAndInventoryUpdatePayload, IItemContainer, ItemSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { Types } from "mongoose";

@provide(PickPocket)
export class PickPocket {
  constructor(
    private characterInventory: CharacterInventory,
    private characterItemInventory: CharacterItemInventory,
    private socketMessaging: SocketMessaging,
    private characterItemsContainer: CharacterItemContainer,
    private characterWeight: CharacterWeight
  ) {}

  @TrackNewRelicTransaction()
  public async handlePickPocket(character: ICharacter, target: ICharacter): Promise<boolean> {
    if (target.type !== "Character") {
      this.socketMessaging.sendErrorMessageToCharacter(character, "You can only stolen from characters!");

      return false;
    }

    const characterInventory = await this.characterInventory.getInventory(character);
    const targetInventory = await this.characterInventory.getInventory(target);

    if (!characterInventory || !targetInventory) {
      throw new Error("Character inventory or item container not found");
    }

    const allItemsInInventory = await this.characterInventory.getAllItemsFromInventory(target);

    if (!allItemsInInventory) {
      this.socketMessaging.sendErrorMessageToCharacter(character, "The target doesn't have anything to steal!");

      return false;
    }

    const filteredItemsInInventory: Record<string, IItem[]> = Object.entries(allItemsInInventory).reduce(
      (allItemsInInventory, [itemContainerId, allItemsInContainer]) => {
        const containerItems = allItemsInContainer.filter((item) => item.type !== "Container");

        if (containerItems.length > 0) {
          allItemsInInventory[itemContainerId] = containerItems;
        }

        return allItemsInInventory;
      },
      {} as Record<string, IItem[]>
    );

    const allContainersId = Object.keys(filteredItemsInInventory);
    const randomContainerId = _.sample(allContainersId);
    const items = filteredItemsInInventory[randomContainerId!];

    const randomItem = _.sample(items);
    if (!randomItem) {
      return false;
    }

    try {
      const stolenStackQty = 1;
      const decrementFromTarget = await this.characterItemInventory.decrementItemFromContainer(
        randomItem._id,
        target,
        stolenStackQty,
        randomContainerId!
      );

      if (decrementFromTarget) {
        const basicItem = await blueprintManager.getBlueprint<IItem>("items", randomItem.key as AvailableBlueprints);

        const newItem = new Item({
          ...basicItem,
          attack: randomItem.attack,
          defense: randomItem.defense,
          rarity: randomItem.rarity,
          _id: Types.ObjectId(),
          owner: character._id,
          stackQty: stolenStackQty,
        });

        await newItem.save();

        const addStolenItem = await this.characterItemsContainer.addItemToContainer(
          newItem,
          character,
          characterInventory?.itemContainer as string
        );

        if (addStolenItem) {
          let prefix = "a";
          if ("aeiouAEIOU".includes(randomItem.name.charAt(0))) {
            prefix = "an";
          }

          this.socketMessaging.sendMessageToCharacter(character, `You stole ${prefix} ${randomItem.name}!`);
          this.socketMessaging.sendMessageToCharacter(target, `You lost ${prefix} ${randomItem.name}!`);

          await this.characterWeight.updateCharacterWeight(character);
          await this.characterWeight.updateCharacterWeight(target);

          await this.updateInventoryOnClient(character);
          await this.updateInventoryOnClient(target);

          return true;
        }
      }

      return false;
    } catch (error) {
      console.log(`Error stealing item from ${target._id}`, error);

      return false;
    }
  }

  private async updateInventoryOnClient(character: ICharacter): Promise<void> {
    const inventory = await this.characterInventory.getInventory(character);
    const inventoryContainer = (await ItemContainer.findById(inventory?.itemContainer)) as unknown as IItemContainer;

    const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
      inventory: inventoryContainer,
      openEquipmentSetOnUpdate: false,
      openInventoryOnUpdate: true,
    };

    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );
  }
}
