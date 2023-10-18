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
  EXHAUSTABLE_EVENTS,
  LOCKABLE_EVENTS,
  LOGGABLE_EVENTS,
  THROTTABLE_DEFAULT_MS_THRESHOLD,
  THROTTABLE_EVENTS,
  THROTTABLE_EVENTS_MS_THRESHOLD_DISCONNECT,
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

  @TrackNewRelicTransaction()
  public authCharacterOn(
    channel,
    event: string,
    callback: (data, character: ICharacter, owner: IUser) => Promise<any>,
    runBasicCharacterValidation: boolean = true,
    isLeanQuery = true
  ): void {
    this.removeListenerIfExists(channel, event);

    channel.on(event, async (data: any) => {
      try {
        if (!(await this.acquireGlobalLock(`global-lock-event-${event}-${channel.id}`))) return;

        const [owner, character] = await this.getCharacterAndOwner(channel, data, isLeanQuery);
        if (!(await this.validateCharacterAndProceed(character, channel.id, runBasicCharacterValidation))) return;

        await this.handleEventLogic(channel, event, data, callback, character, owner);
      } catch (error) {
        console.error(error);
      } finally {
        await this.releaseGlobalLock(`global-lock-event-${event}-${channel.id}`);
      }
    });
  }

  private async handleEventLogic(
    channel,
    event: string,
    data: any,
    callback: (data, character: ICharacter, owner: IUser) => Promise<any>,
    character: ICharacter,
    owner: IUser
  ): Promise<void> {
    await this.newRelic.trackTransaction(NewRelicTransactionCategory.SocketEvent, event, async (): Promise<void> => {
      const shouldLog = this.shouldLogEvent(event);
      const shouldSetLastAction = this.shouldSetLastAction(event);
      const isLockableEvent = LOCKABLE_EVENTS.includes(event);

      const [isExhausted, isThrottleViolated] = await Promise.all([
        this.isExhausted(character, event),
        this.isThrottleViolated(character, event),
      ]);

      if (shouldLog) {
        this.logEvent(character, event);
      }

      if (isExhausted) {
        this.notifyExhaustion(channel);
        return;
      }

      if (isThrottleViolated) {
        return;
      }

      if (shouldSetLastAction) {
        await this.characterLastAction.setLastAction(character._id, dayjs().toISOString());
      }

      if (isLockableEvent) {
        await this.performLockedEvent(character._id, character.name, event, async () => {
          await callback(data, character, owner);
        });
        return;
      }

      await callback(data, character, owner);
    });
  }

  private shouldSetLastAction(event: string): boolean {
    return !BYPASS_EVENTS_AS_LAST_ACTION.includes(event as any);
  }

  private shouldLogEvent(event: string): boolean {
    return appEnv.general.DEBUG_MODE && !appEnv.general.IS_UNIT_TEST && LOGGABLE_EVENTS.includes(event);
  }

  private logEvent(character: ICharacter, event: string): void {
    console.log(
      `📝 ${character.name} (Id: ${character._id}) - (Channel: ${
        character.channelId
      }) => Event: ${event} at ${dayjs().toISOString()}`
    );
  }

  private async isExhausted(character: ICharacter, event: string): Promise<boolean> {
    return (
      EXHAUSTABLE_EVENTS.includes(event) &&
      (await this.exhaustValidation.verifyLastActionExhaustTime(character.channelId!, event))
    );
  }

  private notifyExhaustion(channel): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(channel.id!, UISocketEvents.ShowMessage, {
      message: "Sorry, you're exhausted!",
      type: "error",
    });
  }

  private async isThrottleViolated(character: ICharacter, event: string): Promise<boolean> {
    if (Object.keys(THROTTABLE_EVENTS).includes(event)) {
      const lastActionExecution = await this.characterLastAction.getActionLastExecution(character._id, event);

      if (lastActionExecution) {
        const diff = dayjs().diff(dayjs(lastActionExecution), "millisecond");

        if (diff < THROTTABLE_EVENTS_MS_THRESHOLD_DISCONNECT) {
          setTimeout(async () => {
            await this.characterBan.addPenalty(character);
          }, 5000);

          this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
            reason: "You're disconnected for spamming the server with events.",
          });

          return true;
        }

        if (diff < THROTTABLE_DEFAULT_MS_THRESHOLD) {
          this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
            message: "Sorry, you're doing it too fast!",
            type: "error",
          });

          return true;
        }
      }

      await this.characterLastAction.setActionLastExecution(character._id, event);
    }

    return false;
  }

  private removeListenerIfExists(channel, event: string): void {
    channel.removeAllListeners(event);
  }

  private async acquireGlobalLock(lockName: string): Promise<boolean> {
    return await this.locker.lock(lockName);
  }

  private async releaseGlobalLock(lockName: string): Promise<void> {
    await this.locker.unlock(lockName);
  }

  private async getCharacterAndOwner(channel, data: any, isLeanQuery: boolean): Promise<[IUser, ICharacter]> {
    const owner = channel?.userData || (channel?.handshake?.query?.userData as IUser);
    const query = { _id: data.socketCharId, owner: owner._id };
    const character = isLeanQuery
      ? await Character.findOne(query).lean({ virtuals: true, defaults: true })
      : await Character.findOne(query);
    return [owner, character as ICharacter];
  }

  private async validateCharacterAndProceed(
    character: ICharacter,
    channelId: string,
    runBasicCharacterValidation: boolean
  ): Promise<boolean> {
    if (!character) {
      this.socketMessaging.sendEventToUser(channelId, CharacterSocketEvents.CharacterForceDisconnect, {
        reason: "You don't own this character!",
      });
      return false;
    }

    if (character.isSoftDeleted) {
      this.socketMessaging.sendEventToUser(channelId, CharacterSocketEvents.CharacterForceDisconnect, {
        reason: "Sorry, you cannot play with this character anymore!",
      });
      return false;
    }

    if (runBasicCharacterValidation) {
      const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

      if (!hasBasicValidation) {
        return false;
      }
    }

    return true;
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
