import { appEnv } from "@providers/config/env";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { EnvType } from "@rpg-engine/shared";
import { Job, Queue, Worker } from "bullmq";
import { v4 as uuidv4 } from "uuid";

type CallbackRecord = () => void;

@provideSingleton(ItemUseCycleQueue)
export class ItemUseCycleQueue {
  private queue: Queue;
  private worker: Worker;
  private itemCallbacks = new Map<string, CallbackRecord>();

  private queueName: string = `item-use-cycle-${uuidv4()}-${
    appEnv.general.ENV === EnvType.Development ? "dev" : process.env.pm_id
  }`;

  constructor() {
    this.queue = new Queue(this.queueName, {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      this.queueName,
      async (job) => {
        let { characterId, itemKey, iterations, intervalDurationMs } = job.data;

        try {
          const callback = this.itemCallbacks.get(`${characterId}-${itemKey}`);

          if (!callback) {
            return;
          }

          await callback();

          iterations--;

          if (iterations > 0) {
            await this.add(characterId, itemKey, iterations, intervalDurationMs);
          }
        } catch (err) {
          console.error("Error processing item-use-cycle queue", err);
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
        console.log(`ItemUseCycle job ${job?.id} failed with error ${err.message}`);
      });

      this.queue.on("error", (error) => {
        console.error("Error in the ItemUseCycleQueue:", error);
      });
    }
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

  public async shutdown(): Promise<void> {
    await this.queue.close();
    await this.worker.close();
  }

  public async start(
    characterId: string,
    itemKey: string,
    iterations: number,
    intervalDurationMs: number,
    callback: CallbackRecord
  ): Promise<void> {
    this.itemCallbacks.set(`${characterId}-${itemKey}`, callback);

    // execute first callback
    await callback();

    await this.add(characterId, itemKey, iterations, intervalDurationMs);
  }

  private async add(
    characterId: string,
    itemKey: string,
    iterations: number,
    intervalDurationMs: number
  ): Promise<Job> {
    return await this.queue.add(
      this.queueName,
      {
        characterId,
        itemKey,
        iterations,
        intervalDurationMs,
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
        delay: intervalDurationMs,
      }
    );
  }
}
