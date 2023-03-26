import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
import { CharacterLastAction } from "@providers/character/CharacterLastAction";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { appEnv } from "@providers/config/env";
import { BYPASS_EVENTS_AS_LAST_ACTION } from "@providers/constants/EventsConstants";
import { EXHAUSTABLE_EVENTS, USER_EXHAUST_TIMEOUT } from "@providers/constants/ServerConstants";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { CharacterSocketEvents, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { SocketMessaging } from "./SocketMessaging";

@provideSingleton(SocketAuth)
export class SocketAuth {
  private isExhausted: Map<string, boolean> = new Map();

  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private characterLastAction: CharacterLastAction
  ) {}

  // this event makes sure that the user who's triggering the request actually owns the character!
  public authCharacterOn(
    channel,
    event: string,
    callback: (data, character: ICharacter, owner: IUser) => Promise<any>,
    runBasicCharacterValidation: boolean = true
  ): void {
    channel.on(event, async (data: any) => {
      let owner, character;

      try {
        // check if authenticated user actually owns the character (we'll fetch it from the payload id);
        owner = channel?.userData || (channel?.handshake?.query?.userData as IUser);

        const spammingEvents = this.isSpammingEvents(channel, event, owner);

        if (spammingEvents) return;

        character = await Character.findOne({
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

        try {
          await callback(data, character, owner);

          if (!BYPASS_EVENTS_AS_LAST_ACTION.includes(event as any)) {
            await this.characterLastAction.setLastAction(character._id, dayjs().toISOString());
          }
        } catch (e) {
          console.error(e);
        }
      } catch (error) {
        console.error(`${character.name} => ${event}, channel ${channel} failed with error: ${error}`);
      }
    });
  }

  private isSpammingEvents(channel, event: string, owner): boolean {
    if (EXHAUSTABLE_EVENTS.includes(event)) {
      // block users from spamming the server with events
      const userId = owner.id.toString();
      const exhausted = this.isExhausted.get(userId);
      if (exhausted) {
        this.socketMessaging.sendEventToUser<IUIShowMessage>(channel.id!, UISocketEvents.ShowMessage, {
          message: "Sorry, you're exhausted!",
          type: "error",
        });
        return true;
      }
      this.isExhausted.set(userId, true);
      setTimeout(() => {
        this.isExhausted.delete(userId);
      }, USER_EXHAUST_TIMEOUT);
    }

    return false;
  }
}
