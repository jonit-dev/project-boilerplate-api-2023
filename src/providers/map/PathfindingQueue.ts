import { INPC } from "@entities/ModuleNPC/NPCModel";
import { appEnv } from "@providers/config/env";
import { Time } from "@providers/time/Time";
import { Job, Queue, Worker } from "bullmq";
import { provide } from "inversify-binding-decorators";
import { Pathfinder } from "./Pathfinder";
import { PathfindingResults } from "./PathfindingResults";

@provide(PathfindingQueue)
export class PathfindingQueue {
  private queue: Queue;
  private worker: Worker;

  constructor(private pathfinder: Pathfinder, private pathfindingResults: PathfindingResults, private time: Time) {}

  async addPathfindingJob(
    npc: INPC,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): Promise<Job> {
    const queueName = `npc-${npc._id}-pathfinding`;
    this.queue = new Queue(queueName, {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    await this.queue.drain(true);

    this.worker = new Worker(
      queueName,
      async (job) => {
        const { npc, startGridX, startGridY, endGridX, endGridY } = job.data;

        try {
          const path = await this.pathfinder.findShortestPath(
            npc as INPC,
            npc.scene,
            startGridX,
            startGridY,
            endGridX,
            endGridY
          );

          if (!path) {
            return;
          }

          await this.pathfindingResults.setResult(job.id!, path);
        } catch (err) {
          console.error(`Error processing pathfinding for NPC ${npc.key}:`, err);
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

    this.worker.on("failed", (job, err) => {
      console.log(`Job ${job?.id} failed with error ${err.message}`);
    });

    return await this.queue.add(
      queueName,
      { npc, startGridX, startGridY, endGridX, endGridY },
      { removeOnComplete: true, removeOnFail: true }
    );
  }
}
