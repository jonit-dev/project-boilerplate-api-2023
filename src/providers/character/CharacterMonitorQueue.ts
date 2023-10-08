import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { Locker } from "@providers/locks/Locker";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import { EnvType } from "@rpg-engine/shared";
import { Queue, Worker } from "bullmq";

// uniqueId
import { v4 as uuidv4 } from "uuid";

type CharacterMonitorCallback = (character: ICharacter) => void;

type CallbackRecord = Record<string, CharacterMonitorCallback>;

@provideSingleton(CharacterMonitorQueue)
export class CharacterMonitorQueue {
  private queue: Queue<any, any, string>;
  private worker: Worker;
  private charactersCallbacks = new Map<string, CallbackRecord>();
  private queueName: string = `character-monitor-queue-${uuidv4()}-${
    appEnv.general.ENV === EnvType.Development ? "dev" : process.env.pm_id
  }`;

  constructor(private newRelic: NewRelic, private locker: Locker) {
    this.queue = new Queue(this.queueName, {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      this.queueName,
      async (job) => {
        const { character, callbackId, intervalMs } = job.data;

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

          await this.execMonitorCallback(character, callbackId, intervalMs);
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
        console.log(`${this.queueName} job ${job?.id} failed with error ${err.message}`);
      });

      this.queue.on("error", (error) => {
        console.error(`Error in ${this.queueName}`, error);
      });
    }
  }

  public async watch(
    callbackId: string,
    character: ICharacter,
    callback: CharacterMonitorCallback,
    intervalMs: number = 3000
  ): Promise<void> {
    const canProceed = await this.locker.lock(`character-monitor-${character._id.toString()}-callback-${callbackId}`);

    if (!canProceed) {
      return;
    }

    const currentCallbackRecord = this.charactersCallbacks.get(character._id.toString());

    const isWatching = this.isWatching(callbackId, character);

    if (isWatching) {
      return;
    }

    this.charactersCallbacks.set(character._id.toString(), {
      ...currentCallbackRecord,
      [callbackId]: callback,
    });

    if (intervalMs < 3000) {
      intervalMs = 3000;
    }

    await this.add(character, callbackId, intervalMs);
  }

  public isWatching(callbackId: string, character: ICharacter): boolean {
    const currentCallbackRecord = this.charactersCallbacks.get(character._id.toString());

    const hasCallback = currentCallbackRecord?.[callbackId];

    return !!hasCallback;
  }

  public async unwatch(callbackId: string, character: ICharacter): Promise<void> {
    const currentCallbacks = this.charactersCallbacks.get(character._id.toString());

    if (!currentCallbacks) {
      return;
    }

    delete currentCallbacks[callbackId];

    if (Object.keys(currentCallbacks).length === 0) {
      this.charactersCallbacks.delete(character._id.toString());
    }

    this.charactersCallbacks.set(character._id.toString(), currentCallbacks);

    await this.locker.unlock(`character-monitor-${character._id.toString()}-callback-${callbackId}`);
  }

  public unwatchAll(character: ICharacter): void {
    this.charactersCallbacks.delete(character._id);
  }

  private async add(character: ICharacter, callbackId: string, intervalMs: number): Promise<void> {
    if (appEnv.general.IS_UNIT_TEST) {
      await this.execMonitorCallback(character, callbackId, intervalMs);
      return;
    }

    await this.queue.add(
      this.queueName,
      {
        character,
        callbackId,
        intervalMs,
      },
      {
        delay: intervalMs,
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  }

  @TrackNewRelicTransaction()
  private async execMonitorCallback(character: ICharacter, callbackId: string, intervalMs: number): Promise<void> {
    // execute character callback
    const characterCallbacks = this.charactersCallbacks.get(character._id.toString());

    console.log("execMonitorCallback", character._id.toString(), callbackId, intervalMs);

    const callback = characterCallbacks?.[callbackId];

    if (callback) {
      const updatedCharacter = (await Character.findOne({ _id: character._id }).lean({
        virtuals: true,
        defaults: true,
      })) as ICharacter;

      if (!updatedCharacter.isOnline) {
        await this.unwatch(callbackId, character);
        return;
      }

      // execute callback
      callback(updatedCharacter);

      await this.add(character, callbackId, intervalMs);
    }
  }
}
