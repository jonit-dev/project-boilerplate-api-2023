import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IPartyManagementFromClient, PartySocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";

@provide(PartyNetworkAcceptInvite)
export class PartyNetworkAcceptInvite {
  constructor(private socketAuth: SocketAuth, private partyManagement: PartyManagement) {}
  // #TODO REMOVE
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

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          if (!target) {
            throw new Error("Error on joing party, character target not found");
          }

          await this.partyManagement.acepptInvite(leader, target, character);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
