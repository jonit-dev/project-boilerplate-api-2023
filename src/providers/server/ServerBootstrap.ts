import { PushNotificationHelper } from "@providers/pushNotification/PushNotificationHelper";
import { Seeder } from "@providers/seeds/Seeder";

import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { DiscordBot } from "@providers/discord/DiscordBot";
import { Locker } from "@providers/locks/Locker";
import { SocketSessionControl } from "@providers/sockets/SocketSessionControl";
import { EnvType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { PM2Helper } from "./PM2Helper";

@provide(ServerBootstrap)
export class ServerBootstrap {
  constructor(
    private pm2Helper: PM2Helper,
    private seeder: Seeder,
    private locker: Locker,
    private inMemoryHashTable: InMemoryHashTable,
    private discordBot: DiscordBot,
    private socketSessionControl: SocketSessionControl
  ) {}

  // operations that can be executed in only one CPU instance without issues with pm2 (ex. setup centralized state doesnt need to be setup in every pm2 instance!)
  @TrackNewRelicTransaction()
  public async performOneTimeOperations(): Promise<void> {
    if (appEnv.general.ENV === EnvType.Development) {
      // in dev we always want to execute it.. since we dont have pm2
      await this.execOneTimeOperations();
    } else {
      // Production/Staging with PM2
      if (process.env.pm_id === this.pm2Helper.pickLastCPUInstance()) {
        await this.execOneTimeOperations();
      }
    }
  }

  @TrackNewRelicTransaction()
  public async performMultipleInstancesOperations(): Promise<void> {
    this.discordBot.initialize();

    await this.queueShutdownHandling();

    await this.clearAllQueues();
  }

  public queueShutdownHandling(): void {
    const execQueueShutdown = async (): Promise<void> => {
      // shutdown queues here
    };

    process.on("SIGTERM", async () => {
      await execQueueShutdown();

      process.exit(0);
    });

    process.on("SIGINT", async () => {
      await execQueueShutdown();
      process.exit(0);
    });
  }

  private async execOneTimeOperations(): Promise<void> {
    await this.socketSessionControl.clearAllSessions();

    // Firebase-admin setup, that push notification requires.
    PushNotificationHelper.initialize();

    // this.heapMonitor.monitor();

    await this.seeder.start();

    await this.locker.clear();
  }

  //! remove this when using
  // eslint-disable-next-line require-await
  private async clearAllQueues(): Promise<void> {
    // clear all queue jobs here

    console.log("🧹 BullMQ queues cleared...");
  }
}
