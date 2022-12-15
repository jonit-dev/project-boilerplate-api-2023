import { Depot } from "@entities/ModuleDepot/DepotModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { MAX_DISTANCE_TO_NPC_IN_GRID } from "@providers/constants/DepotConstants";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { Types } from "mongoose";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  DepotSocketEvents,
  IDepotContainerOpen,
  IItemContainer,
  IItemContainerRead,
  ItemContainerType,
  ItemSocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(DepotNetworkOpen)
export class DepotNetworkOpen {
  constructor(
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation
  ) {}

  public onDepotContainerOpen(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      DepotSocketEvents.OpenContainer,
      async (data: IDepotContainerOpen, character) => {
        try {
          // Check if character is alive and not banned
          const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

          if (!hasBasicValidation) {
            return;
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

          if (!npc.hasDepot) {
            throw new Error(
              `DepotContainerOpen > NPC does not support depot ('hasDepot' = false): NPC id ${data.npcId}`
            );
          }

          const itemContainer = await this.getDepotContainer(character.id, data.npcId);

          this.socketMessaging.sendEventToUser<IItemContainerRead>(
            character.channelId!,
            ItemSocketEvents.ContainerRead,
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

  private async getDepotContainer(characterId: string, npcId: string): Promise<IItemContainer> {
    let itemContainer: IItemContainer;

    const depot = await Depot.findOne({
      owner: Types.ObjectId(characterId),
      npc: Types.ObjectId(npcId),
    })
      .populate("itemContainer")
      .exec();

    if (depot) {
      itemContainer = depot.itemContainer as unknown as IItemContainer;
    } else {
      // Depot does not exist, create new one
      let newDepot = new Depot({
        owner: Types.ObjectId(characterId),
        npc: Types.ObjectId(npcId),
      });

      newDepot = await newDepot.save();
      let depotItemContainer = new ItemContainer({
        parentItem: newDepot._id,
        name: "Depot",
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
