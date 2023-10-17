import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { NPCFreezer } from "@providers/npc/NPCFreezer";
import { NPCSpawn } from "@providers/npc/NPCSpawn";
import { NPCRaidActivator } from "@providers/raid/NPCRaidActivator";
import { NPCRaidSpawn } from "@providers/raid/NPCRaidSpawn";

import { provide } from "inversify-binding-decorators";

import { CronJobScheduler } from "./CronJobScheduler";

@provide(NPCCrons)
export class NPCCrons {
  constructor(
    private npcSpawn: NPCSpawn,
    private newRelic: NewRelic,
    private npcRaidSpawn: NPCRaidSpawn,
    private npcRaidActivator: NPCRaidActivator,
    private npcFreezer: NPCFreezer,
    private cronJobScheduler: CronJobScheduler
  ) {}

  public schedule(): void {
    this.cronJobScheduler.uniqueSchedule("npc-spawn-cron", "* * * * *", async () => {
      // filter all dead npcs that have a nextSpawnTime > now

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

    this.cronJobScheduler.uniqueSchedule("npc-raid-shutdown", "* * * * *", async () => {
      await this.npcRaidActivator.shutdownRaids();
    });

    this.cronJobScheduler.uniqueSchedule("npc-raid-activator", "0 */6 * * *", async () => {
      await this.npcRaidActivator.activateRaids();
    });

    this.cronJobScheduler.uniqueSchedule("npc-freezer", "*/5 * * * *", async () => {
      await this.npcFreezer.freezeNPCsWithoutCharactersAround();
    });
  }
}
