import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketConnection } from "@providers/sockets/SocketConnection";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterLogoutPayload, CharacterSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterView } from "../CharacterView";

@provide(CharacterNetworkLogout)
export class CharacterNetworkLogout {
  constructor(
    private geckosMessagingHelper: SocketMessaging,
    private socketAuth: SocketAuth,
    private socketConnection: SocketConnection,
    private characterView: CharacterView
  ) {}

  public onCharacterLogout(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterLogout,
      async (data: CharacterLogoutPayload, character: ICharacter) => {
        const nearbyCharacters = await this.characterView.getCharactersInView(character);

        for (const character of nearbyCharacters) {
          this.geckosMessagingHelper.sendEventToUser<CharacterLogoutPayload>(
            character.channelId!,
            CharacterSocketEvents.CharacterLogout,
            data
          );
        }

        console.log(`🚪: Character id ${data.id} has disconnected`);

        character.isOnline = false;
        await character.save();

        const connectedCharacters = await this.socketConnection.getConnectedCharacters();

        console.log("- Total characters connected:", connectedCharacters.length);
      }
    );
  }
}
