// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { GeckosAuth } from "@providers/geckos/GeckosAuth";
import { ICharacter, IConnectedPlayer, PlayerGeckosEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { GeckosMessaging } from "../geckos/GeckosMessaging";
import { GeckosServerHelper } from "../geckos/GeckosServerHelper";

@provide(PlayerCreate)
export class PlayerCreate {
  constructor(private geckosMessagingHelper: GeckosMessaging, private geckosAuth: GeckosAuth) {}

  public onPlayerCreate(channel: ServerChannel): void {
    this.geckosAuth.authCharacterOn(channel, PlayerGeckosEvents.PlayerCreate, async (data: IConnectedPlayer) => {
      const character = data.character;
      character.isOnline = true;
      await character.save();

      // here we inject our server side character properties, to make sure the client is not hacking anything!
      data = {
        ...data,
        name: character.name,
        x: character.x,
        y: character.y,
        direction: character.direction,
        isMoving: false,
      };

      if (!GeckosServerHelper.connectedPlayers[data.id]) {
        // if there's no player with this id connected, add it.
        console.log(`💡: Player ${data.name} has connected!`);
        console.log(data);
        GeckosServerHelper.connectedPlayers[data.id] = {
          ...data,
          lastActivity: Date.now(),
        };

        const creationRequestValid = this.checkIfCreationRequestIsValid(data, character, ["x", "y", "direction"]);

        console.log("creationRequestValid", creationRequestValid);

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

  private checkIfCreationRequestIsValid(
    clientCharacter: IConnectedPlayer,
    serverCharacter: ICharacter,
    keysToCompare: string[]
  ): boolean {
    for (const key of keysToCompare) {
      if (typeof serverCharacter[key] === "number") {
        if (Math.round(clientCharacter[key]) !== Math.round(serverCharacter[key])) {
          console.log(
            `🚨: Error on validation ${PlayerGeckosEvents.PlayerCreate} event. ${key} is not valid for character ${serverCharacter.name}!`
          );
          return false;
        }
      } else {
        if (clientCharacter[key] !== serverCharacter[key]) {
          console.log(
            `🚨: Error on validation ${PlayerGeckosEvents.PlayerCreate} event. ${key} is not valid for character ${serverCharacter.name}!`
          );
          return false;
        }
      }
    }

    return true;
  }
}
