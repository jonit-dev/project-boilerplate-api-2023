import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";
import { ICharacterPartyChange, IPartyManagementFromClient, PartySocketEvents } from "@rpg-engine/shared";

@provide(PartyNetworkCreate)
export class PartyNetworkCreate {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private partyManagement: PartyManagement
  ) {}

  public onCreateParty(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.Create,
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

          const createParty = await this.partyManagement.createParty(leader, target);

          if (!createParty) {
            throw new Error("Error on create party");
          }
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
