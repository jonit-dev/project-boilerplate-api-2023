import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { PartySocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import PartyManagement from "../PartyManagement";

@provide(PartyNetworkGetParty)
export class PartyNetworkGetParty {
  constructor(private socketAuth: SocketAuth, private partyManagement: PartyManagement) {}

  public onPartyInfoRead(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, PartySocketEvents.PartyInfoRead, async (_, character: ICharacter) => {
      try {
        await this.partyManagement.partyInfoRead(character);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
