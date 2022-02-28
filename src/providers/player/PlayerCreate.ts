import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { GeckosAuth } from "@providers/geckos/GeckosAuth";
import { GeckosConnection } from "@providers/geckos/GeckosConnection";
import { GeckosServerHelper } from "@providers/geckos/GeckosServerHelper";
import { IConnectedPlayer, PlayerGeckosEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { GeckosMessaging } from "../geckos/GeckosMessaging";
import { PlayerView } from "./PlayerView";

@provide(PlayerCreate)
export class PlayerCreate {
  constructor(
    private geckosMessagingHelper: GeckosMessaging,
    private geckosAuth: GeckosAuth,
    private geckosConnection: GeckosConnection,
    private playerView: PlayerView
  ) {}

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

      const otherPlayersInViewIds = await this.playerView.getCharactersInView(character as unknown as ICharacter);

      await this.playerView.bidirectionalUpdateCharactersInView(
        character as unknown as ICharacter,
        otherPlayersInViewIds as string[]
      );

      // update server camera coordinates and other players in view
      //! Refactor once client is refactored!
      //! Warning: this is being passed by the client, so it can't be trusted! Refactor later to calculate this on server side!
      character.cameraCoordinates = data.cameraCoordinates;
      await character.save();

      // if there's no player with this id connected, add it.
      console.log(`💡: Player ${data.name} has connected!`);
      console.log(data);

      GeckosServerHelper.connectedPlayers[data.id] = {
        ...data,
        lastActivity: Date.now(),
      };

      channel.join(data.channelId); // join channel specific to the user, to we can send direct  later if we want.

      const connectedCharacters = await this.geckosConnection.getConnectedCharacters();

      console.log("- Total players connected:", connectedCharacters.length);

      this.sendCreationMessageToPlayers(data.channelId, data.id, data);
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
