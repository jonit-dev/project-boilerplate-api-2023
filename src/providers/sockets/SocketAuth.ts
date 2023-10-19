/* eslint-disable require-await */
import { IUser } from "@entities/ModuleSystem/UserModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";

import { appEnv } from "@providers/config/env";
import { BYPASS_EVENTS_AS_LAST_ACTION } from "@providers/constants/EventsConstants";
import { LOGGABLE_EVENTS } from "@providers/constants/ServerConstants";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { Locker } from "@providers/locks/Locker";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import dayjs from "dayjs";
import { SocketMessaging } from "./SocketMessaging";

@provideSingleton(SocketAuth)
export class SocketAuth {
  constructor(
    private socketMessaging: SocketMessaging,

    private newRelic: NewRelic,
    private locker: Locker
  ) {}

  @TrackNewRelicTransaction()
  public authCharacterOn(
    channel,
    event: string,
    callback: (data, owner: IUser) => Promise<any>,
    runBasicCharacterValidation: boolean = true,
    isLeanQuery = true
  ): void {
    this.removeListenerIfExists(channel, event);

    channel.on(event, async (data: any) => {
      try {
        if (!(await this.acquireGlobalLock(`global-lock-event-${event}-${channel.id}`))) return;

        // const [owner, ] = await this.getCharacterAndOwner(channel, data, isLeanQuery);

        const owner = {} as IUser; //! Remove this line when using

        await this.handleEventLogic(channel, event, data, callback, owner);
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
    callback: (data, owner: IUser) => Promise<any>,

    owner: IUser
  ): Promise<void> {
    await this.newRelic.trackTransaction(NewRelicTransactionCategory.SocketEvent, event, async (): Promise<void> => {
      const shouldLog = this.shouldLogEvent(event);

      if (shouldLog) {
        this.logEvent(owner, event);
      }

      await callback(data, owner);
    });
  }

  private shouldSetLastAction(event: string): boolean {
    return !BYPASS_EVENTS_AS_LAST_ACTION.includes(event as any);
  }

  private shouldLogEvent(event: string): boolean {
    return appEnv.general.DEBUG_MODE && !appEnv.general.IS_UNIT_TEST && LOGGABLE_EVENTS.includes(event);
  }

  private logEvent(user: IUser, event: string): void {
    console.log(`(📝 ${user.name}) => Event: ${event} at ${dayjs().toISOString()}`);
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
