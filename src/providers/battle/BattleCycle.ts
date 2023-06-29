import { appEnv } from "@providers/config/env";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { Queue, Worker } from "bullmq";
import { provide } from "inversify-binding-decorators";

@provide(BattleCycle)
export class BattleCycle {
  private queue: Queue;
  private worker: Worker;

  constructor(private inMemoryHashTable: InMemoryHashTable) {}

  public async init(id: string, intervalSpeed: number, fn: () => void | Promise<void>): Promise<void> {
    const queueName = `battle-cycle-${id}`;

    // clear out any stop flags
    await this.inMemoryHashTable.set("battle-cycle-stop-flags", id, false);

    this.queue = new Queue(queueName, {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      queueName,
      async (job) => {
        try {
          const hasStopFlag = await this.inMemoryHashTable.get("battle-cycle-stop-flags", id);

          if (hasStopFlag) {
            console.log("stop flag found, stopping...");

            // clear repeatable
            await this.queue.removeRepeatable(queueName, {
              every: intervalSpeed,
            });

            await this.queue.close();
            await this.worker.close();
            return;
          }

          console.log("executing function...");
          await fn();
        } catch (error) {
          console.error(error);
        }
      },
      {
        connection: {
          host: appEnv.database.REDIS_CONTAINER,
          port: Number(appEnv.database.REDIS_PORT),
        },
      }
    );

    this.worker.on("failed", (job, err) => {
      console.log(`Job ${job?.id} failed with error ${err.message}`);
    });

    await this.queue.add(
      queueName,
      {},
      {
        repeat: {
          every: intervalSpeed,
        },
      }
    );
  }

  public async stop(id: string): Promise<void> {
    await this.inMemoryHashTable.set("battle-cycle-stop-flags", id, true);
  }
}
