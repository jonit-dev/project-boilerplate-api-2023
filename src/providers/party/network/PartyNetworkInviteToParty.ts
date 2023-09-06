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
      PartySocketEvents.PartyInvite,
      async (data: IPartyManagementFromClient, _character: ICharacter) => {
        try {
          const leader = (await Character.findById(data.leaderId).lean()) as ICharacter;
          if (!leader) {
            throw new Error("Error on invite to party, leader not found");
          }

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          if (!target) {
            throw new Error("Error on invite to party, target not found");
          }

          await this.partyManagement.inviteToParty(leader, target);
        } catch (error) {
          console.error(error);
        }
      }
    );

    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.AcceptInvite,
      async (data: IPartyManagementFromClient, _character: ICharacter) => {
        try {
          const leader = (await Character.findById(data.leaderId).lean()) as ICharacter;

          if (!leader) {
            throw new Error("Error on joing party, character leader not found");
          }

          const target = (await Character.findById(data.targetId).lean()) as ICharacter;
          if (!target) {
            throw new Error("Error on joing party, character target not found");
          }

          const party = await this.partyManagement.acceptInvite(leader, target);

          if (party) {
            await this.partyManagement.partyPayloadSend(party);
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
