/* eslint-disable require-await */
import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { IUser } from "@entities/ModuleSystem/UserModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { CharacterBan } from "@providers/character/CharacterBan";
import { CharacterLastAction } from "@providers/character/CharacterLastAction";
import { CharacterValidation } from "@providers/character/CharacterValidation";
import { appEnv } from "@providers/config/env";
import { BYPASS_EVENTS_AS_LAST_ACTION } from "@providers/constants/EventsConstants";
import {
  DEBOUNCEABLE_EVENTS,
  DEBOUNCEABLE_EVENTS_MS_THRESHOLD,
  DEBOUNCEABLE_EVENTS_MS_THRESHOLD_DISCONNECT,
  EXHAUSTABLE_EVENTS,
  LOCKABLE_EVENTS,
  LOGGABLE_EVENTS,
} from "@providers/constants/ServerConstants";
import { ExhaustValidation } from "@providers/exhaust/ExhaustValidation";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { Locker } from "@providers/locks/Locker";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { CharacterSocketEvents, IUIShowMessage, UISocketEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { SocketMessaging } from "./SocketMessaging";

@provideSingleton(SocketAuth)
export class SocketAuth {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterValidation: CharacterValidation,
    private exhaustValidation: ExhaustValidation,
    private characterLastAction: CharacterLastAction,
    private newRelic: NewRelic,
    private locker: Locker,
    private characterBan: CharacterBan
  ) {}

  // this event makes sure that the user who's triggering the request actually owns the character!
  @TrackNewRelicTransaction()
  public authCharacterOn(
    channel,
    event: string,
    callback: (data, character: ICharacter, owner: IUser) => Promise<any>,
    runBasicCharacterValidation: boolean = true,
    isLeanQuery = true
  ): void {
    // remove listener to this event, if exists, to avoid duplicates
    channel.removeAllListeners(event);

    channel.on(event, async (data: any) => {
      let owner, character;

      try {
        // check if authenticated user actually owns the character (we'll fetch it from the payload id);
        owner = channel?.userData || (channel?.handshake?.query?.userData as IUser);

        character = isLeanQuery
          ? await Character.findOne({
              _id: data.socketCharId,
              owner: owner._id,
            }).lean({ virtuals: true, defaults: true })
          : await Character.findOne({
              _id: data.socketCharId,
              owner: owner._id,
            });

        if (!character) {
          this.socketMessaging.sendEventToUser(channel.id!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "You don't own this character!",
          });
          return;
        }

        if (character.isSoftDeleted) {
          this.socketMessaging.sendEventToUser(channel.id!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "Sorry, you cannot play with this character anymore!",
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

        if (LOGGABLE_EVENTS.includes(event)) {
          const now = dayjs().toISOString();
          console.log(
            `📝 ${character.name} (Id: ${character._id}) - (Channel: ${character.channelId}) => Event: ${event} at ${now}`
          );
        }

        if (!BYPASS_EVENTS_AS_LAST_ACTION.includes(event as any)) {
          await this.characterLastAction.setLastAction(character._id, dayjs().toISOString());
        }

        await this.newRelic.trackTransaction(
          NewRelicTransactionCategory.SocketEvent,
          event,
          async (): Promise<void> => {
            if (DEBOUNCEABLE_EVENTS.includes(event)) {
              const lastActionExecution = await this.characterLastAction.getActionLastExecution(character._id, event);

              if (lastActionExecution) {
                const diff = dayjs().diff(dayjs(lastActionExecution), "millisecond");

                if (diff < DEBOUNCEABLE_EVENTS_MS_THRESHOLD_DISCONNECT) {
                  setTimeout(async () => {
                    await this.characterBan.addPenalty(character);
                  }, 5000);

                  this.socketMessaging.sendEventToUser(
                    character.channelId!,
                    CharacterSocketEvents.CharacterForceDisconnect,
                    {
                      reason: "You're disconnected for spamming the server with events.",
                    }
                  );

                  return;
                }

                if (diff < DEBOUNCEABLE_EVENTS_MS_THRESHOLD) {
                  this.socketMessaging.sendEventToUser<IUIShowMessage>(channel.id!, UISocketEvents.ShowMessage, {
                    message: "Sorry, you're doing it too fast!",
                    type: "error",
                  });

                  return;
                }
              }

              await this.characterLastAction.setActionLastExecution(character._id, event);
            }

            if (LOCKABLE_EVENTS.includes(event)) {
              await this.performLockedEvent(character._id, character.name, event, async (): Promise<void> => {
                await callback(data, character, owner);
              });

              return;
            }

            await callback(data, character, owner);
          }
        );
      } catch (error) {
        console.error(`${character.name} => ${event}, channel ${channel} failed with error: ${error}`);

        if (LOCKABLE_EVENTS.includes(event)) {
          await this.locker.unlock(`event-${event}-${character._id}`);
        }
      }
    });
  }

  // This prevents the user from spamming the same event over and over again to gain some benefits (like duplicating items)
  private async performLockedEvent(
    characterId: string,
    characterName: string,
    event: string,
    callback: () => Promise<void>
  ): Promise<void> {
    try {
      const hasLocked = await this.locker.lock(`event-${event}-${characterId}`);
      if (!hasLocked) {
        console.log(`⚠️ ${characterId} - (${characterName}) tried to perform '${event}' but it was locked!`);
        return;
      }
      await callback();
    } catch (error) {
      console.error(error);
      await this.locker.unlock(`event-${event}-${characterId}`);
    } finally {
      await this.locker.unlock(`event-${event}-${characterId}`);
    }
  }
}
