import { Events } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { GeckosMessaging } from "../geckos/GeckosMessaging";

export interface IBaseData {
  id: string;
  channelId: string;
  otherPlayersInView: IAbstractPlayerData;
}

export interface IAbstractPlayerData {
  [key: string]: any;
}

@provide(DataRetransmission)
export class DataRetransmission {
  constructor(private geckosMessagingHelper: GeckosMessaging) {}

  public bidirectionalDataRetransmission<DataType extends IBaseData>(
    data: DataType,
    event: Events,
    checkKeysForChangeToUpdateEmitter: string[],
    sendAdditionalDataToEmitter?: Record<string, unknown>
  ): void {
    //! Case 1: Warn close players about my data update!

    this.geckosMessagingHelper.sendMessageToClosePlayers(data.id, event, data);

    //! Case 2: Warn emitter about other players data

    // update the emitter nearby players positions
    const nearbyPlayers = this.geckosMessagingHelper.getPlayersOnCameraView(data.id) as IAbstractPlayerData[];

    if (nearbyPlayers) {
      for (const nearbyPlayer of nearbyPlayers) {
        // we want to warn the emitter in 2 situations:
        // if we dont have this player in our emitter view
        // if we have this player in our view, BUT the data representation we have on the server is different than the data representation we have on the client

        if (this.emitterHasAlreadyPlayerData(data, nearbyPlayer, checkKeysForChangeToUpdateEmitter)) {
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

          console.log("submitting data to emitter ", dataToSubmit);

          this.geckosMessagingHelper.sendEventToUser<any>(data.channelId, event, {
            ...dataToSubmit,
            ...sendAdditionalDataToEmitter,
          });
        }
      }
    }
  }

  private emitterHasAlreadyPlayerData(
    emitterData: IBaseData,
    nearbyPlayer: IAbstractPlayerData,
    checkKeysToUpdate: string[]
  ): boolean {
    const emitterInfoAboutNearbyPlayer = emitterData.otherPlayersInView[nearbyPlayer.id];

    if (!emitterInfoAboutNearbyPlayer) return false;

    for (const key of checkKeysToUpdate) {
      if (nearbyPlayer[key] !== emitterInfoAboutNearbyPlayer[key]) {
        return false;
      }
    }

    return true;
  }
}
