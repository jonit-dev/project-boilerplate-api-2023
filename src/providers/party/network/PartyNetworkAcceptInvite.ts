import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IPartyManagementFromClient, PartySocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";

@provide(PartyNetworkAcceptInvite)
export class PartyNetworkAcceptInvite {
  constructor(private socketAuth: SocketAuth, private partyManagement: PartyManagement) {}

  public onAcceptInvite(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.AcceptInvite,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const leader = (await Character.findById(data.leaderId).lean()) as ICharacter;

          if (!leader) {
            throw new Error("Error on joing party, character leader not found");
          }

          // #TODO: change targetId for character._id, there is no meaning for have data.targetId
          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          if (!target) {
            throw new Error("Error on joing party, character target not found");
          }

          await this.partyManagement.acepptInvite(leader, target);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
