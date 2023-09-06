import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { IPartyManagementFromClient, PartySocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";
import { CharacterParty, ICharacterParty } from "@entities/ModuleCharacter/CharacterPartyModel";

@provide(PartyNetworkGetParty)
export class PartyNetworkGetParty {
  constructor(private socketAuth: SocketAuth, private partyManagement: PartyManagement) {}

  public onPartyPayloadSend(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PartySocketEvents.PartyInfoRead,
      async (data: IPartyManagementFromClient, character: ICharacter) => {
        try {
          const { partyId, leaderId, targetId } = data;
          let party: ICharacterParty | null = null;

          if (partyId) {
            party = (await CharacterParty.findById(partyId).lean()) as ICharacterParty;

            if (party) {
              await this.partyManagement.partyPayloadSend(party);
              return;
            }
          }

          const characterId = leaderId || targetId || character._id;

          party = (await this.partyManagement.getPartyByCharacterId(characterId)) as ICharacterParty;

          await this.partyManagement.partyPayloadSend(party || null, party ? undefined : [character._id]);
        } catch (error) {
          console.error(error);
        }
      }
    );
  }
}
