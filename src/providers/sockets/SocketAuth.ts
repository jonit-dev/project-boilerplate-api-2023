import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
import { CharacterLastAction } from "@providers/character/CharacterLastAction";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { appEnv } from "@providers/config/env";
import { BYPASS_EVENTS_AS_LAST_ACTION } from "@providers/constants/EventsConstants";
import { EXHAUSTABLE_EVENTS } from "@providers/constants/ServerConstants";
import { ExhaustValidation } from "@providers/exhaust/ExhaustValidation";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { CharacterSocketEvents, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { SocketMessaging } from "./SocketMessaging";

@provideSingleton(SocketAuth)
export class SocketAuth {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private exhaustValidation: ExhaustValidation,
    private characterLastAction: CharacterLastAction
  ) {}

  // this event makes sure that the user who's triggering the request actually owns the character!
  public authCharacterOn(
    channel,
    event: string,
    callback: (data, character: ICharacter, owner: IUser) => Promise<any>,
    runBasicCharacterValidation: boolean = true,
    isLeanQuery = true
  ): void {
    channel.on(event, async (data: any) => {
      let owner, character;

      try {
        // check if authenticated user actually owns the character (we'll fetch it from the payload id);
        owner = channel?.userData || (channel?.handshake?.query?.userData as IUser);

        character = isLeanQuery
          ? await Character.findOne({
              _id: data.socketCharId,
              owner: owner.id,
            }).lean({ virtuals: true, defaults: true })
          : await Character.findOne({
              _id: data.socketCharId,
              owner: owner.id,
            });

        if (!character) {
          this.socketMessaging.sendEventToUser(channel.id!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "You don't own this character!",
          });
          return;
        }

        if (runBasicCharacterValidation) {
          const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

          if (!hasBasicValidation) {
            return;
          }
        }

        if (appEnv.general.DEBUG_MODE && !appEnv.general.IS_UNIT_TEST) {
          console.log("⬇️ (RECEIVED): ", character.name, character.channelId!, event);
        }

        if (EXHAUSTABLE_EVENTS.includes(event)) {
          const isExhausted = await this.exhaustValidation.verifyLastActionExhaustTime(character.channelId!, event);
          if (isExhausted) {
            this.socketMessaging.sendEventToUser<IUIShowMessage>(channel.id!, UISocketEvents.ShowMessage, {
              message: "Sorry, you're exhausted!",
              type: "error",
            });
            return;
          }
        }

        if (!BYPASS_EVENTS_AS_LAST_ACTION.includes(event as any)) {
          await this.characterLastAction.setLastAction(character._id, dayjs().toISOString());
        }

        try {
          await callback(data, character, owner);
        } catch (e) {
          console.error(e);
        }
        // console.log(`📨 Received ${event} from ${character.name}(${character._id}): ${JSON.stringify(data)}`);
      } catch (error) {
        console.error(`${character.name} => ${event}, channel ${channel} failed with error: ${error}`);
      }
    });
  }
}
