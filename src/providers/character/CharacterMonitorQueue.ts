import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { Locker } from "@providers/locks/Locker";
import { PM2Helper } from "@providers/server/PM2Helper";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import { Queue, Worker } from "bullmq";

type CharacterMonitorCallback = (character: ICharacter) => void;

type CallbackRecord = Record<string, CharacterMonitorCallback>;

@provideSingleton(CharacterMonitorQueue)
export class CharacterMonitorQueue {
  private queue: Queue<any, any, string>;
  private worker: Worker;
  private charactersCallbacks = new Map<string, CallbackRecord>();

  constructor(private newRelic: NewRelic, private locker: Locker, private pm2Helper: PM2Helper) {
    this.queue = new Queue("character-monitor-queue", {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      "character-monitor-queue",
      async (job) => {
        const { character, callbackId } = job.data;

        if (!character.isOnline) {
          return;
        }

        try {
          await this.newRelic.trackMetric(
            NewRelicMetricCategory.Count,
            NewRelicSubCategory.Characters,
            "CharacterMonitor",
            1
          );

          await this.execMonitorCallback(character, callbackId);
        } catch (err) {
          console.error("Error processing character monitor queue", err);
          throw err;
        }
      },
      {
        connection: {
          host: appEnv.database.REDIS_CONTAINER,
          port: Number(appEnv.database.REDIS_PORT),
        },
      }
    );

    if (!appEnv.general.IS_UNIT_TEST) {
      this.worker.on("failed", (job, err) => {
        console.log(`character-monitor-queue job ${job?.id} failed with error ${err.message}`);
      });

      this.queue.on("error", (error) => {
        console.error("Error in the character-monitor-queue :", error);
      });
    }
  }

  public async watch(callbackId: string, character: ICharacter, callback: CharacterMonitorCallback): Promise<void> {
    const currentCallbackRecord = this.charactersCallbacks.get(character._id.toString());

    const hasCallback = currentCallbackRecord?.[callbackId];

    if (hasCallback) {
      return;
    }

    this.charactersCallbacks.set(character._id.toString(), {
      ...currentCallbackRecord,
      [callbackId]: callback,
    });

    await this.add(character, callbackId);
  }

  public unwatch(character: ICharacter): void {
    this.charactersCallbacks.delete(character._id);
  }

  private async add(character: ICharacter, callbackId: string): Promise<void> {
    if (appEnv.general.IS_UNIT_TEST) {
      await this.execMonitorCallback(character, callbackId);
      return;
    }

    await this.queue.add(
      "character-monitor-queue",
      {
        character,
        callbackId,
      },
      {
        delay: 3000,
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  }

  public async clearAllJobs(): Promise<void> {
    const jobs = await this.queue.getJobs(["waiting", "active", "delayed", "paused"]);
    for (const job of jobs) {
      try {
        await job?.remove();
      } catch (err) {
        console.error(`Error removing job ${job?.id}:`, err.message);
      }
    }
  }

  @TrackNewRelicTransaction()
  private async execMonitorCallback(character: ICharacter, callbackId: string): Promise<void> {
    // execute character callback
    const characterCallbacks = this.charactersCallbacks.get(character._id.toString());

    const callback = characterCallbacks?.[callbackId];

    if (callback) {
      const updatedCharacter = (await Character.findOne({ _id: character._id }).lean({
        virtuals: true,
        defaults: true,
      })) as ICharacter;

      if (!updatedCharacter.isOnline) {
        return;
      }

      // execute callback
      callback(updatedCharacter);

      await this.add(character, callbackId);
    }
  }
}
