import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NPCSpawn } from "@providers/npc/NPCSpawn";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";

import nodeCron from "node-cron";

@provide(NPCCrons)
export class NPCCrons {
  constructor(private npcSpawn: NPCSpawn, private newRelic: NewRelic) {}

  public schedule(): void {
    nodeCron.schedule("* * * * *", () => {
      // filter all dead npcs that have a nextSpawnTime > now

      this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "NPCSpawn", async () => {
        const deadNPCs = (await NPC.find({
          health: 0,
          isBehaviorEnabled: false,
          nextSpawnTime: {
            $exists: true,
            $lte: new Date(),
          },
        }).lean()) as INPC[];

        for (const deadNPC of deadNPCs) {
          await this.npcSpawn.spawn(deadNPC);
        }
      });
    });
  }
}
