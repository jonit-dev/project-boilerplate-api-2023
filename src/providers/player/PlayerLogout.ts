import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { GeckosAuth } from "@providers/geckos/GeckosAuth";
import { GeckosConnection } from "@providers/geckos/GeckosConnection";
import { PlayerGeckosEvents, PlayerLogoutPayload } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { GeckosMessaging } from "../geckos/GeckosMessaging";
import { PlayerView } from "./PlayerView";

@provide(PlayerLogout)
export class PlayerLogout {
  constructor(
    private geckosMessagingHelper: GeckosMessaging,
    private geckosAuth: GeckosAuth,
    private geckosConnection: GeckosConnection,
    private playerView: PlayerView
  ) {}

  public onPlayerLogout(channel: ServerChannel): void {
    this.geckosAuth.authCharacterOn(
      channel,
      PlayerGeckosEvents.PlayerLogout,
      async (data: PlayerLogoutPayload, character: ICharacter) => {
        const nearbyPlayers = await this.playerView.getCharactersInView(character);

        for (const player of nearbyPlayers) {
          this.geckosMessagingHelper.sendEventToUser<PlayerLogoutPayload>(
            player.channelId!,
            PlayerGeckosEvents.PlayerLogout,
            data
          );
        }

        console.log(`🚪: Player id ${data.id} has disconnected`);

        character.isOnline = false;
        await character.save();

        const connectedPlayers = await this.geckosConnection.getConnectedCharacters();

        console.log("- Total players connected:", connectedPlayers.length);
      }
    );
  }
}
