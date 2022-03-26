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

export interface IAbstractCharacterData {
  [key: string]: any;
}

@provide(SocketRetransmission)
export class SocketRetransmission {
  constructor(private socketMessaging: SocketMessaging, private characterView: CharacterView) {}

  public async bidirectionalDataRetransmission<DataType extends IBaseData>(
    originCharacter: ICharacter,
    data: DataType,
    event: Events,
    checkKeysForChangeToUpdateEmitter: string[],
    sendAdditionalDataToEmitter?: Record<string, unknown>
  ): Promise<void> {
    //! Case 1: Warn close characters about my data update!

    await this.socketMessaging.sendMessageToCloseCharacters(originCharacter, event, data);

    //! Case 2: Warn emitter about other characters data

    // update the emitter nearby characters positions
    const nearbyCharacters = await this.characterView.getCharactersInView(originCharacter);

    if (nearbyCharacters) {
      for (const nearbyCharacter of nearbyCharacters) {
        // we want to warn the emitter in 2 situations:
        // if we dont have this character in our emitter view
        // if we have this character in our view, BUT the data representation we have on the server is different than the data representation we have on the client

        if (await this.emitterHasAlreadyCharacterData(data, nearbyCharacter, checkKeysForChangeToUpdateEmitter)) {
          console.log(
            `Emitter ${data.id} already has character ${nearbyCharacter.name} position data updated. Skipping sending package.`
          );
          continue;
        }

        if (nearbyCharacter.id !== data.id) {
          // send nearbyCharacter info to emitter!

          const emitterDataKeys = Object.keys(data);

          // create new object from nearbyCharacter, based on emitterDataKeys

          const dataToSubmit = {} as IAbstractCharacterData;

          for (const key of emitterDataKeys) {
            dataToSubmit[key] = nearbyCharacter[key];
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

  private emitterHasAlreadyCharacterData(
    clientEmitterData: IBaseData, // what's coming from the client
    serverNearbyCharacter: IAbstractCharacterData, // what we have on the server
    checkKeysToUpdate: string[]
  ): boolean {
    const emitterInfoAboutNearbyCharacter = clientEmitterData.otherEntitiesInView[serverNearbyCharacter.id];

    if (!emitterInfoAboutNearbyCharacter) return false;

    // Compares nearbyCharacter server side data with the data that the client has (if it matches, we dont need to update them!)
    for (const key of checkKeysToUpdate) {
      if (serverNearbyCharacter[key] !== emitterInfoAboutNearbyCharacter[key]) {
        return false;
      }
    }

    return true;
  }
}
