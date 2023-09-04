import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NPCSpawn } from "@providers/npc/NPCSpawn";
import { NPCRaidActivator } from "@providers/raid/NPCRaidActivator";
import { NPCRaidSpawn } from "@providers/raid/NPCRaidSpawn";

import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { provide } from "inversify-binding-decorators";

import nodeCron from "node-cron";

@provide(NPCCrons)
export class NPCCrons {
  constructor(
    private npcSpawn: NPCSpawn,
    private newRelic: NewRelic,
    private npcRaidSpawn: NPCRaidSpawn,
    private npcRaidActivator: NPCRaidActivator
  ) {}

  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
      // filter all dead npcs that have a nextSpawnTime > now

      await this.newRelic.trackTransaction(NewRelicTransactionCategory.CronJob, "NPCSpawn", async () => {
        const deadNPCs = (await NPC.find({
          health: 0,
          isBehaviorEnabled: false,
          nextSpawnTime: {
            $exists: true,
            $lte: new Date(),
          },
        }).lean()) as INPC[];

        const deadRaidNPCs = await this.npcRaidSpawn.fetchDeadNPCsFromActiveRaids();

        deadNPCs.push(...deadRaidNPCs);

        for (const deadNPC of deadNPCs) {
          await this.npcSpawn.spawn(deadNPC, !!deadNPC.raidKey);
        }
      });
    });

    nodeCron.schedule("* * * * *", async () => {
      await this.npcRaidActivator.shutdownRaids();
    });

    // Run every hour
    nodeCron.schedule("0 */2 * * *", async () => {
      await this.npcRaidActivator.activateRaids();
    });
  }
}
