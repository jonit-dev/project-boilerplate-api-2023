import { CharacterValidation } from "@providers/character/CharacterValidation";
import { MAX_DISTANCE_TO_NPC_IN_GRID } from "@providers/constants/DepotConstants";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  DepotSocketEvents,
  IItemContainerRead,
  ItemContainerType,
  ItemSocketEvents,
  IDepotDepositItem,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { DepositItem } from "../DepositItem";
import { DepotSystem } from "../DepotSystem";

@provide(DepotNetworkDeposit)
export class DepotNetworkDeposit {
  constructor(
    private socketAuth: SocketAuth,
    private movementHelper: MovementHelper,
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private depotSystem: DepotSystem,
    private depositItem: DepositItem
  ) {}

  public onDepotContainerDeposit(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, DepotSocketEvents.Deposit, async (data: IDepotDepositItem, character) => {
      try {
        // Check if character is alive and not banned
        const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

        if (!hasBasicValidation) {
          return;
        }

        const npc = await this.depotSystem.npcBasicValidation(data.npcId);

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

        const itemContainer = await this.depositItem.deposit(character.id, data);

        this.socketMessaging.sendEventToUser<IItemContainerRead>(character.channelId!, ItemSocketEvents.ContainerRead, {
          itemContainer,
          type: ItemContainerType.MapContainer,
        });
      } catch (error) {
        console.error(error);
      }
    });
  }
}
