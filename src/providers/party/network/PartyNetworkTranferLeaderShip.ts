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
          const leader = (await Character.findById(character._id).lean()) as ICharacter;
          const target = (await Character.findById(data.targetId).lean()) as ICharacter;

          await this.partyManagement.transferLeadership(leader, target, character);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
