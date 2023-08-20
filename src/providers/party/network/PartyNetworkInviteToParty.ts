import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IPartyManagementFromClient, PartySocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";

@provide(PartyNetworkInviteToParty)
export class PartyNetworkInviteToParty {
  constructor(private socketAuth: SocketAuth, private partyManagement: PartyManagement) {}

  public onInviteToParty(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.Invite,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const leader = (await Character.findById(data.leaderId).lean()) as ICharacter;
          if (!leader) {
            throw new Error("Error on leave party, character leader not found");
          }

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          if (!target) {
            throw new Error("Error on leave party, character target not found");
          }

          await this.partyManagement.inviteToParty(leader, target, character);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
