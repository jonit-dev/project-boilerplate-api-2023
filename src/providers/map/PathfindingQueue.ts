import { INPC } from "@entities/ModuleNPC/NPCModel";
import { appEnv } from "@providers/config/env";
import { Time } from "@providers/time/Time";
import { Job, Queue, Worker } from "bullmq";
import { provide } from "inversify-binding-decorators";
import { random } from "lodash";
import { Pathfinder } from "./Pathfinder";
import { PathfindingResults } from "./PathfindingResults";

@provide(PathfindingQueue)
export class PathfindingQueue {
  private queue: Queue;
  private worker: Worker;

  constructor(private pathfinder: Pathfinder, private pathfindingResults: PathfindingResults, private time: Time) {
    this.queue = new Queue("pathfinding", {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      "pathfinding",
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
  }

  async addPathfindingJob(
    npc: INPC,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): Promise<Job> {
    // avoid clogging the queue wtih too many jobs at the same time
    await this.time.waitForMilliseconds(random(50, 150));

    return await this.queue.add(
      "pathfindingJob",
      { npc, startGridX, startGridY, endGridX, endGridY },
      { removeOnComplete: true }
    );
  }
}
