import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IPartyManagementFromClient, PartySocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";

@provide(PartyNetworkInviteOrCreate)
export class PartyNetworkInviteOrCreate {
  constructor(private socketAuth: SocketAuth, private partyManagement: PartyManagement) {}

  public onInviteOrCreateParty(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.InviteOrCreate,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const leader = (await Character.findById(character._id).lean()) as ICharacter;

          if (!leader) {
            throw new Error("Error on leave party, character leader not found");
          }
          const target = (await Character.findById(data.targetId).lean()) as ICharacter;

          if (!target) {
            throw new Error("Error on leave party, character target not found");
          }

          await this.partyManagement.inviteOrCreateParty(leader, target);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
