import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NPCSpawn } from "@providers/npc/NPCSpawn";
import { provide } from "inversify-binding-decorators";

import nodeCron from "node-cron";

@provide(NPCCrons)
export class NPCCrons {
  constructor(private npcSpawn: NPCSpawn) {}

  public schedule(): void {
    nodeCron.schedule("* * * * *", async () => {
      // filter all dead npcs that have a nextSpawnTime > now

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
  }
}
