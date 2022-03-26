import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { CharacterView } from "@providers/character/CharacterView";
import { Events, IEntitiesInView } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { SocketMessaging } from "./SocketMessaging";

export interface IBaseData {
  id: string;
  channelId: string;
  otherEntitiesInView: IEntitiesInView;
}

export interface IAbstractPlayerData {
  [key: string]: any;
}

@provide(SocketRetransmission)
export class SocketRetransmission {
  constructor(private socketMessaging: SocketMessaging, private playerView: CharacterView) {}

  public async bidirectionalDataRetransmission<DataType extends IBaseData>(
    originCharacter: ICharacter,
    data: DataType,
    event: Events,
    checkKeysForChangeToUpdateEmitter: string[],
    sendAdditionalDataToEmitter?: Record<string, unknown>
  ): Promise<void> {
    //! Case 1: Warn close players about my data update!

    await this.socketMessaging.sendMessageToClosePlayers(originCharacter, event, data);

    //! Case 2: Warn emitter about other players data

    // update the emitter nearby players positions
    const nearbyPlayers = await this.playerView.getCharactersInView(originCharacter);

    if (nearbyPlayers) {
      for (const nearbyPlayer of nearbyPlayers) {
        // we want to warn the emitter in 2 situations:
        // if we dont have this player in our emitter view
        // if we have this player in our view, BUT the data representation we have on the server is different than the data representation we have on the client

        if (await this.emitterHasAlreadyPlayerData(data, nearbyPlayer, checkKeysForChangeToUpdateEmitter)) {
          console.log(
            `Emitter ${data.id} already has player ${nearbyPlayer.name} position data updated. Skipping sending package.`
          );
          continue;
        }

        if (nearbyPlayer.id !== data.id) {
          // send nearbyPlayer info to emitter!

          const emitterDataKeys = Object.keys(data);

          // create new object from nearbyPlayer, based on emitterDataKeys

          const dataToSubmit = {} as IAbstractPlayerData;

          for (const key of emitterDataKeys) {
            dataToSubmit[key] = nearbyPlayer[key];
          }

          const payload = {
            ...dataToSubmit,
            ...sendAdditionalDataToEmitter,
          };

          console.log("submitting data to emitter ", payload);

          this.socketMessaging.sendEventToUser<any>(data.channelId, event, payload);
        }
      }
    }
  }

  private emitterHasAlreadyPlayerData(
    clientEmitterData: IBaseData, // what's coming from the client
    serverNearbyPlayer: IAbstractPlayerData, // what we have on the server
    checkKeysToUpdate: string[]
  ): boolean {
    const emitterInfoAboutNearbyPlayer = clientEmitterData.otherEntitiesInView[serverNearbyPlayer.id];

    if (!emitterInfoAboutNearbyPlayer) return false;

    // Compares nearbyPlayer server side data with the data that the client has (if it matches, we dont need to update them!)
    for (const key of checkKeysToUpdate) {
      if (serverNearbyPlayer[key] !== emitterInfoAboutNearbyPlayer[key]) {
        return false;
      }
    }

    return true;
  }
}
