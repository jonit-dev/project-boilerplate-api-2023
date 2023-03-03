/* eslint-disable no-undef */
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import random from "lodash/random";
import { NPC_BATTLE_CYCLES } from "./NPCBattleCycle";
import { NPC_CYCLES } from "./NPCCycle";
import { NPCView } from "./NPCView";

import { appEnv } from "@providers/config/env";
import { NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE } from "@providers/constants/NPCConstants";
import { PM2Helper } from "@providers/server/PM2Helper";
import { EnvType } from "@rpg-engine/shared";
import CPUusage from "cpu-percentage";
import round from "lodash/round";

@provideSingleton(NPCFreezer)
export class NPCFreezer {
  public freezeCheckIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private npcView: NPCView, private pm2Helper: PM2Helper) {
    if (appEnv.general.IS_UNIT_TEST) {
      return;
    }

    this.setCPUUsageCheckInterval();
  }

  public tryToFreezeNPC(npc: INPC): void {
    if (this.freezeCheckIntervals.has(npc.id)) {
      return; // interval is already, running, lets not create another one!
    }
    if (!npc.isBehaviorEnabled) {
      return;
    }

    // every 5-10 seconds, check if theres a character nearby. If not, shut down NPCCycle.
    const checkRange = random(2000, 4000);

    const interval = setInterval(async () => {
      const shouldFreezeNPC = await this.shouldFreezeNPC(npc);

      if (!shouldFreezeNPC) {
        return;
      }

      await this.freezeNPC(npc);

      clearInterval(interval);
    }, checkRange);

    this.freezeCheckIntervals.set(npc.id, interval);
  }

  public async freezeNPC(npc: INPC, isForced?: boolean): Promise<void> {
    if (appEnv.general.ENV === EnvType.Development) {
      console.log(`Freezing NPC ${npc.key} (${npc.id}) ${isForced ? "(FORCED)" : ""}`);
    }

    await NPC.updateOne({ _id: npc._id }, { isBehaviorEnabled: false });
    const npcCycle = NPC_CYCLES.get(npc.id);

    if (npcCycle) {
      await npcCycle.clear();
    }

    const battleCycle = NPC_BATTLE_CYCLES.get(npc.id);

    if (battleCycle) {
      await battleCycle.clear();
    }

    this.freezeCheckIntervals.delete(npc.id);
  }

  // This works like a security measure to prevent the server from crashing due to high CPU usage if there are too many NPCs active at the same time.
  private setCPUUsageCheckInterval(): void {
    const start = CPUusage();
    const checkInterval = 5000;
    const maxCPUUsagePerInstance = 70;

    setInterval(async () => {
      const end = CPUusage(start);
      const totalCPUUsage = round(end.percent);

      if (appEnv.general.ENV === EnvType.Development) {
        console.log(
          `NPC_CYCLES: ${NPC_CYCLES.size} NPC_BATTLE_CYCLES: ${NPC_BATTLE_CYCLES.size} CPU_USAGE: ${totalCPUUsage}%`
        );
      }

      const totalActiveNPCs = await NPC.countDocuments({ isBehaviorEnabled: true });

      if (totalActiveNPCs >= NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE) {
        const diff = totalActiveNPCs - NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE;

        for (let i = 0; i < diff; i++) {
          await this.freezeRandomNPC(totalCPUUsage);
        }

        return;
      }

      if (totalCPUUsage >= maxCPUUsagePerInstance) {
        const freezeCount = Math.ceil(totalActiveNPCs * 0.3);
        for (let i = 0; i < freezeCount; i++) {
          await this.freezeRandomNPC(totalCPUUsage);
        }
      }
    }, checkInterval);
  }

  private async shouldFreezeNPC(npc: INPC): Promise<boolean> {
    const nearbyCharacters = await this.npcView.getCharactersInView(npc);

    return !nearbyCharacters.length;
  }

  private async freezeRandomNPC(usage: number): Promise<void> {
    const npcIds = Array.from(NPC_CYCLES.keys());
    const randomNpcId = random(0, npcIds.length - 1);
    const npcCycle = NPC_CYCLES.get(npcIds[randomNpcId]);

    if (!npcCycle) {
      return;
    }

    const npc = await NPC.findById(npcCycle.id);

    if (!npc) {
      throw new Error(`Failed to freeze NPC! NPC ${npcCycle.id} not found`);
    }

    await this.freezeNPC(npc, true);
  }
}
