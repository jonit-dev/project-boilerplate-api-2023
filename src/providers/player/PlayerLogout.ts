import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketConnection } from "@providers/sockets/SocketConnection";
import { PlayerLogoutPayload, PlayerSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SocketMessaging } from "../sockets/SocketMessaging";
import { PlayerView } from "./PlayerView";

@provide(PlayerLogout)
export class PlayerLogout {
  constructor(
    private geckosMessagingHelper: SocketMessaging,
    private socketAuth: SocketAuth,
    private socketConnection: SocketConnection,
    private playerView: PlayerView
  ) {}

  public onPlayerLogout(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      PlayerSocketEvents.PlayerLogout,
      async (data: PlayerLogoutPayload, character: ICharacter) => {
        const nearbyPlayers = await this.playerView.getCharactersInView(character);

        for (const player of nearbyPlayers) {
          this.geckosMessagingHelper.sendEventToUser<PlayerLogoutPayload>(
            player.channelId!,
            PlayerSocketEvents.PlayerLogout,
            data
          );
        }

        console.log(`🚪: Player id ${data.id} has disconnected`);

        character.isOnline = false;
        await character.save();

        const connectedPlayers = await this.socketConnection.getConnectedCharacters();

        console.log("- Total players connected:", connectedPlayers.length);
      }
    );
  }
}
