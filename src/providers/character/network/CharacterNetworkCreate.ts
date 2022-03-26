import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
// @ts-ignore
import { ServerChannel } from "@geckos.io/server";
import { NPCView } from "@providers/npc/NPCView";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketConnection } from "@providers/sockets/SocketConnection";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { CharacterSocketEvents, ICharacterPositionUpdatePayload } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterView } from "../CharacterView";

@provide(CharacterNetworkCreate)
export class CharacterNetworkCreate {
  constructor(
    private geckosMessagingHelper: SocketMessaging,
    private socketAuth: SocketAuth,
    private geckosConnection: SocketConnection,
    private playerView: CharacterView,
    private socketMessaging: SocketMessaging,
    private npcView: NPCView
  ) {}

  public onCharacterCreate(channel: ServerChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterCreate,
      async (data: ICharacterPositionUpdatePayload, character: ICharacter) => {
        // check if character is already logged in

        if (character.isOnline) {
          // then force logout the current associated client
          this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "You've been disconnected because you logged in from another location!",
          });
        }

        character.isOnline = true;
        character.channelId = data.channelId;
        await character.save();

        await this.npcView.warnUserAboutNPCsInView(character);

        // here we inject our server side character properties, to make sure the client is not hacking anything!
        data = {
          ...data,
          id: character._id,
          name: character.name,
          x: character.x!,
          y: character.y!,
          direction: character.direction,
          isMoving: false,
        };

        // update server camera coordinates and other characters in view
        //! Refactor once client is refactored!
        //! Warning: this is being passed by the client, so it can't be trusted! Refactor later to calculate this on server side!
        character.cameraCoordinates = data.cameraCoordinates;
        await character.save();

        // if there's no character with this id connected, add it.
        console.log(`💡: Character ${data.name} has connected!`);
        console.log(data);

        channel.join(data.channelId); // join channel specific to the user, to we can send direct  later if we want.

        const connectedCharacters = await this.geckosConnection.getConnectedCharacters();

        console.log("- Total characters connected:", connectedCharacters.length);

        this.sendCreationMessageToCharacters(data.channelId, data.id, data, character);
      }
    );
  }

  public async sendCreationMessageToCharacters(
    emitterChannelId: string,
    emitterId: string,
    data: ICharacterPositionUpdatePayload,
    character: ICharacter
  ): Promise<void> {
    const nearbyCharacters = await this.playerView.getCharactersInView(character);

    console.log("warning nearby characters...");
    console.log(nearbyCharacters.map((p) => p.name).join(", "));

    if (nearbyCharacters.length > 0) {
      for (const nearbyCharacter of nearbyCharacters) {
        // tell other character that we exist, so it can create a new instance of us
        this.geckosMessagingHelper.sendEventToUser<ICharacterPositionUpdatePayload>(
          nearbyCharacter.channelId!,
          CharacterSocketEvents.CharacterCreate,
          data
        );

        //! Refactor this!

        const nearbyCharacterPayload = {
          id: nearbyCharacter._id,
          name: nearbyCharacter.name,
          x: nearbyCharacter.x,
          y: nearbyCharacter.y,
          channelId: nearbyCharacter.channelId!,
          direction: nearbyCharacter.direction,
          isMoving: false,
          cameraCoordinates: nearbyCharacter.cameraCoordinates,
        };

        // tell the emitter about these other characters too

        this.geckosMessagingHelper.sendEventToUser<ICharacterPositionUpdatePayload>(
          emitterChannelId,
          CharacterSocketEvents.CharacterCreate,
          // @ts-ignore
          nearbyCharacterPayload
        );
      }
    }
  }
}
