import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { appEnv } from "@providers/config/env";
import { Locker } from "@providers/locks/Locker";
import { Job, Queue, Worker } from "bullmq";
import { provide } from "inversify-binding-decorators";
import { Pathfinder } from "./Pathfinder";
import { PathfindingResults } from "./PathfindingResults";

@provide(PathfindingQueue)
export class PathfindingQueue {
  private queue: Queue;
  private worker: Worker;

  constructor(private pathfinder: Pathfinder, private pathfindingResults: PathfindingResults, private locker: Locker) {
    if (appEnv.general.IS_UNIT_TEST) {
      return;
    }

    this.queue = new Queue("pathfinding", {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      "pathfinding",
      async (job) => {
        const { npc, target, startGridX, startGridY, endGridX, endGridY } = job.data;

        try {
          const path = await this.pathfinder.findShortestPath(
            npc as INPC,
            target,
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
      console.log(`Pathfinding job ${job?.id} failed with error ${err.message}`);
    });

    this.queue.on("error", (error) => {
      console.error("Error in the pathfindingQueue:", error);
    });
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

  async addPathfindingJob(
    npc: INPC,
    target: ICharacter | null,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): Promise<Job | undefined> {
    try {
      const canProceed = await this.locker.lock(`pathfinding-${npc._id}`);

      if (!canProceed) {
        return;
      }

      return await this.queue.add(
        "pathfindingJob",
        { npc, target, startGridX, startGridY, endGridX, endGridY },
        {
          removeOnComplete: true,
          removeOnFail: true,
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 10,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      await this.locker.unlock(`pathfinding-${npc._id}`);
    }
  }

  public async shutdown(): Promise<void> {
    await this.queue.close();
    await this.worker.close();
  }
}
