// @ts-ignore
import { Data, ServerChannel } from "@geckos.io/server";
import { IConnectedPlayer, PlayerGeckosEvents, PlayerLogoutPayload } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { GeckosMessaging } from "../geckos/GeckosMessaging";
import { GeckosServerHelper } from "../geckos/GeckosServerHelper";

@provide(PlayerLogout)
export class PlayerLogout {
  constructor(private geckosMessagingHelper: GeckosMessaging) {}

  public onPlayerLogout(channel: ServerChannel): void {
    channel.on(PlayerGeckosEvents.PlayerLogout, (d: Data) => {
      const data = d as PlayerLogoutPayload;

      // warn nearby players that the emitter logged out

      const emitterPlayer = GeckosServerHelper.connectedPlayers[data.id];

      if (!emitterPlayer) {
        console.log("Failed to emit logout message to nearby players. Emitter not found.");
        return;
      }

      const nearbyPlayers = this.geckosMessagingHelper.getPlayersOnCameraView(emitterPlayer.id);

      for (const player of nearbyPlayers) {
        this.geckosMessagingHelper.sendEventToUser<PlayerLogoutPayload>(
          player.channelId,
          PlayerGeckosEvents.PlayerLogout,
          data
        );
      }

      console.log(`🚪: Player id ${data.id} has disconnected`);
      GeckosServerHelper.connectedPlayers = _.omit(GeckosServerHelper.connectedPlayers, data.id);

      // remove the player from all connected players otherPlayersInView
      for (const [, value] of Object.entries(GeckosServerHelper.connectedPlayers)) {
        const player = value as IConnectedPlayer;
        if (player.otherPlayersInView[data.id]) {
          player.otherPlayersInView = _.omit(player.otherPlayersInView, data.id);

          GeckosServerHelper.connectedPlayers[player.id] = player; // update player info
        }
      }

      console.log("- Total players connected:", Object.entries(GeckosServerHelper.connectedPlayers).length);
    });
  }
}
