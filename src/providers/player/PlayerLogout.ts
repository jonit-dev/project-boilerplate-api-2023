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
        // warn nearby players that the emitter logged out

        const emitterPlayer = character;

        if (!emitterPlayer) {
          console.log("Failed to emit logout message to nearby players. Emitter not found.");
          return;
        }

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
        character.otherPlayersInView = []; // update player who logged out
        await character.save();

        // update other players who has the logged out player in the view
        const otherPlayersInView = await this.playerView.getCharactersInView(character);

        for (const otherPlayer of otherPlayersInView) {
          otherPlayer.otherPlayersInView = otherPlayer.otherPlayersInView?.filter(
            (p: any) => String(p._id) !== data.id
          );
          console.log(otherPlayer.otherPlayersInView);
          await otherPlayer.save();
        }

        const connectedPlayers = await this.geckosConnection.getConnectedCharacters();

        console.log("- Total players connected:", connectedPlayers.length);
      }
    );
  }
}
