import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { NPCSpawn } from "@providers/npc/NPCSpawn";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";

import nodeCron from "node-cron";

@provide(NPCCrons)
export class NPCCrons {
  constructor(private npcSpawn: NPCSpawn, private newRelic: NewRelic, private inMemoryHashTable: InMemoryHashTable) {}

  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
      // filter all dead npcs that have a nextSpawnTime > now

      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "NPCSpawn", async () => {
        const potentialDeadNPCs = (await NPC.find({
          health: 0,
          nextSpawnTime: {
            $exists: true,
            $lte: new Date(),
          },
        }).lean()) as INPC[];

        const deadNPCs: INPC[] = [];
        const namespace = "isBehaviorEnabled";

        // Fetch behaviors for all NPCs at once
        const behaviors = await this.inMemoryHashTable.batchGet(
          namespace,
          potentialDeadNPCs.map((npc) => npc._id.toString())
        );

        for (const potentialDeadNPC of potentialDeadNPCs) {
          const isBehaviorEnabled = behaviors[potentialDeadNPC._id] || false;

          if (!isBehaviorEnabled) {
            deadNPCs.push(potentialDeadNPC);
          }
        }

        for (const deadNPC of deadNPCs) {
          await this.npcSpawn.spawn(deadNPC);
        }
      });
    });
  }
}
