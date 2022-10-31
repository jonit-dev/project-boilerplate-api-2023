import { Depot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  IDepotContainerOpen,
  DepotSocketEvents,
  IItemContainerRead,
  IItemContainer,
  ItemContainerType,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { MAX_DISTANCE_TO_NPC_IN_GRID } from "@providers/constants/DepotConstants";
import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";

@provide(DepotNetworkOpen)
export class DepotNetworkOpen {
  constructor(
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private socketMessaging: SocketMessaging
  ) {}

  public onDepotContainerOpen(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      DepotSocketEvents.OpenContainer,
      async (data: IDepotContainerOpen, character) => {
        try {
          // Check if character is alive and not banned
          if (!character.isAlive) {
            throw new Error(`DepotContainerOpen > Character is dead! Character id: ${character.id}`);
          }

          if (character.isBanned) {
            throw new Error(`DepotContainerOpen > Character is banned! Character id: ${character.id}`);
          }

          if (!character.isOnline) {
            throw new Error(`DepotContainerOpen > Character is offline! Character id: ${character.id}`);
          }

          const npc = await NPC.findOne({
            _id: data.npcId,
          });

          if (!npc) {
            throw new Error(`DepotContainerOpen > NPC not found: ${data.npcId}`);
          }

          // Check if position is at npc's reach
          const isUnderRange = this.movementHelper.isUnderRange(
            character.x,
            character.y,
            npc.x,
            npc.y,
            MAX_DISTANCE_TO_NPC_IN_GRID
          );
          if (!isUnderRange) {
            this.socketMessaging.sendErrorMessageToCharacter(character, "NPC out of reach...");
            return;
          }

          const itemContainer = await this.getDepotContainer(character, data.npcId);

          this.socketMessaging.sendEventToUser<IItemContainerRead>(
            character.channelId!,
            DepotSocketEvents.OpenContainer,
            {
              itemContainer,
              type: ItemContainerType.MapContainer,
            }
          );
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  private async getDepotContainer(character: ICharacter, npcId: string): Promise<IItemContainer> {
    let itemContainer: IItemContainer;

    const depot = await Depot.findOne({
      owner: character.id,
      npc: npcId,
    })
      .populate("itemContainer")
      .exec();

    if (depot) {
      itemContainer = depot.itemContainer as unknown as IItemContainer;
    } else {
      // Depot does not exist, create new one
      let newDepot = new Depot({
        owner: character.id,
        npc: npcId,
      });

      newDepot = await newDepot.save();
      let depotItemContainer = new ItemContainer({
        parentItem: newDepot._id,
      });
      depotItemContainer = await depotItemContainer.save();

      await Depot.updateOne(
        {
          _id: newDepot._id,
        },
        {
          $set: {
            itemContainer: depotItemContainer._id,
          },
        }
      );

      itemContainer = depotItemContainer as unknown as IItemContainer;
    }
    return itemContainer;
  }
}
