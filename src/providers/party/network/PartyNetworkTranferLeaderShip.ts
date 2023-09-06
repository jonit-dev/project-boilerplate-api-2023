import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";
import { IPartyManagementFromClient, PartySocketEvents } from "@rpg-engine/shared";

@provide(PartyNetworkTranferLeaderShip)
export class PartyNetworkTranferLeaderShip {
  constructor(private socketAuth: SocketAuth, private partyManagement: PartyManagement) {}

  public onTranferLeaderShip(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.TransferLeadership,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const eventCaller = (await Character.findById(character._id).lean()) as ICharacter;

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;

          if (!eventCaller || !target) {
            throw new Error("Character not found in TransferLeader party!");
          }

          if (!data.partyId) {
            return;
          }

          const success = await this.partyManagement.transferLeadership(data.partyId, target, eventCaller);

          if (!success) {
            return;
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
