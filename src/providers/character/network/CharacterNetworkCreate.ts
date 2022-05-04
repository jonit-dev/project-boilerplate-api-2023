import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { MapLoader } from "@providers/map/MapLoader";

import { NPCView } from "@providers/npc/NPCView";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketConnection } from "@providers/sockets/SocketConnection";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  AnimationDirection,
  CharacterSocketEvents,
  ICharacterCreateFromClient,
  ICharacterCreateFromServer,
  ScenesMetaData,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { CharacterView } from "../CharacterView";

@provide(CharacterNetworkCreate)
export class CharacterNetworkCreate {
  constructor(
    private socketAuth: SocketAuth,
    private geckosConnection: SocketConnection,
    private playerView: CharacterView,
    private socketMessaging: SocketMessaging,
    private npcView: NPCView
  ) {}

  public onCharacterCreate(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      CharacterSocketEvents.CharacterCreate,
      async (data: ICharacterCreateFromClient, character: ICharacter) => {
        // check if character is already logged in

        if (character.isOnline) {
          // then force logout the current associated client
          this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "You've been disconnected because you logged in from another location!",
          });
        }

        character.isOnline = true;
        character.channelId = data.channelId;
        const map = ScenesMetaData[character.scene].map;
        MapLoader.grids.get(map)!.setWalkableAt(ToGridX(character.x), ToGridY(character.y), false);

        await character.save();

        if (character.isBanned) {
          console.log(`🚫 ${character.name} tried to create its instance while banned!`);

          this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "You cannot use this character while banned.",
          });

          return;
        }

        await this.npcView.warnUserAboutNPCsInView(character);

        // here we inject our server side character properties, to make sure the client is not hacking anything!
        const dataFromServer: ICharacterCreateFromServer = {
          ...data,
          id: character._id,
          name: character.name,
          x: character.x!,
          y: character.y!,
          direction: character.direction as AnimationDirection,
          layer: character.layer,
          speed: character.speed,
          movementIntervalMs: character.movementIntervalMs,
        };

        // if there's no character with this id connected, add it.
        console.log(`💡: Character ${character.name} has connected!`);
        console.log(data);

        channel.join(data.channelId); // join channel specific to the user, to we can send direct  later if we want.

        const connectedCharacters = await this.geckosConnection.getConnectedCharacters();

        console.log("- Total characters connected:", connectedCharacters.length);

        this.sendCreationMessageToCharacters(data.channelId, dataFromServer, character);
      }
    );
  }

  public async sendCreationMessageToCharacters(
    emitterChannelId: string,

    dataFromServer: ICharacterCreateFromServer,
    character: ICharacter
  ): Promise<void> {
    const nearbyCharacters = await this.playerView.getCharactersInView(character);

    console.log("warning nearby characters...");
    console.log(nearbyCharacters.map((p) => p.name).join(", "));

    if (nearbyCharacters.length > 0) {
      for (const nearbyCharacter of nearbyCharacters) {
        // tell other character that we exist, so it can create a new instance of us
        this.socketMessaging.sendEventToUser<ICharacterCreateFromServer>(
          nearbyCharacter.channelId!,
          CharacterSocketEvents.CharacterCreate,
          dataFromServer
        );

        const nearbyCharacterPayload = {
          id: nearbyCharacter._id,
          name: nearbyCharacter.name,
          x: nearbyCharacter.x,
          y: nearbyCharacter.y,
          channelId: nearbyCharacter.channelId!,
          direction: nearbyCharacter.direction as AnimationDirection,
          isMoving: false,
          layer: nearbyCharacter.layer,
          speed: nearbyCharacter.speed,
          movementIntervalMs: nearbyCharacter.movementIntervalMs,
        };

        // tell the emitter about these other characters too

        this.socketMessaging.sendEventToUser<ICharacterCreateFromServer>(
          emitterChannelId,
          CharacterSocketEvents.CharacterCreate,
          nearbyCharacterPayload
        );
      }
    }
  }
}
