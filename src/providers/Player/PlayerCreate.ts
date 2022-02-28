// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { GeckosAuth } from "@providers/geckos/GeckosAuth";
import { IConnectedPlayer, PlayerGeckosEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { GeckosMessaging } from "../geckos/GeckosMessaging";
import { GeckosServerHelper } from "../geckos/GeckosServerHelper";

@provide(PlayerCreate)
export class PlayerCreate {
  constructor(private geckosMessagingHelper: GeckosMessaging, private geckosAuth: GeckosAuth) {}

  public onPlayerCreate(channel: ServerChannel): void {
    this.geckosAuth.authCharacterOn(channel, PlayerGeckosEvents.PlayerCreate, (data: IConnectedPlayer) => {
      if (!GeckosServerHelper.connectedPlayers[data.id]) {
        // if there's no player with this id connected, add it.
        console.log(`💡: Player ${data.name} has connected!`);
        console.log(data);
        GeckosServerHelper.connectedPlayers[data.id] = {
          ...data,
          lastActivity: Date.now(),
        };

        channel.join(data.channelId); // join channel specific to the user, to we can send direct  later if we want.

        console.log("- Total players connected:", Object.entries(GeckosServerHelper.connectedPlayers).length);

        this.sendCreationMessageToPlayers(data.channelId, data.id, data);
      }
    });
  }

  public sendCreationMessageToPlayers(emitterChannelId: string, emitterId: string, data: IConnectedPlayer): void {
    const nearbyPlayers = this.geckosMessagingHelper.getPlayersOnCameraView(emitterId);

    console.log("warning nearby players...");
    console.log(nearbyPlayers.map((p) => p.name).join(", "));

    if (nearbyPlayers.length > 0) {
      for (const player of nearbyPlayers) {
        // tell other player that we exist, so it can create a new instance of us
        this.geckosMessagingHelper.sendEventToUser<IConnectedPlayer>(
          player.channelId,
          PlayerGeckosEvents.PlayerCreate,
          data
        );

        // tell the emitter about these other players too

        this.geckosMessagingHelper.sendEventToUser<IConnectedPlayer>(
          emitterChannelId,
          PlayerGeckosEvents.PlayerCreate,
          player
        );
      }
    }
  }
}
