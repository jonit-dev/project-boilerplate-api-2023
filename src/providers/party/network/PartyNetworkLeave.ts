import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";
import { IPartyManagementFromClient, PartySocketEvents } from "@rpg-engine/shared";

@provide(PartyNetworkLeave)
export class PartyNetworkLeave {
  constructor(private socketAuth: SocketAuth, private partyManagement: PartyManagement) {}

  public onLeaveParty(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.LeaveParty,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const targetOnEvent = (await Character.findById(data.targetId).lean()) as ICharacter;

          if (!targetOnEvent) {
            throw new Error("Error on leave party, character leader not found");
          }

          const eventCaller = (await Character.findById(character._id).lean()) as ICharacter;
          if (!eventCaller) {
            throw new Error("Error on leave party, character eventCaller not found");
          }

          if (!data.partyId) {
            throw new Error("Error on leave party, partyId not found");
          }

          const success = await this.partyManagement.leaveParty(data.partyId, targetOnEvent, eventCaller);

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
