/* eslint-disable no-undef */
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import random from "lodash/random";
import { NPC_BATTLE_CYCLES } from "./NPCBattleCycle";
import { NPC_CYCLES } from "./NPCCycle";
import { NPCView } from "./NPCView";

import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { NPC_FREEZE_CHECK_INTERVAL, NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE } from "@providers/constants/NPCConstants";
import { Locker } from "@providers/locks/Locker";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { EnvType } from "@rpg-engine/shared";
import CPUusage from "cpu-percentage";
import round from "lodash/round";

@provideSingleton(NPCFreezer)
export class NPCFreezer {
  public freezeCheckIntervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(private npcView: NPCView, private newRelic: NewRelic, private locker: Locker) {}

  public init(): void {
    this.setCPUUsageCheckInterval();
  }

  @TrackNewRelicTransaction()
  public async tryToFreezeNPC(npc: INPC): Promise<void> {
    if (this.freezeCheckIntervals.has(npc.id) || !npc.isBehaviorEnabled) {
      return;
    }

    const canProceed = await this.locker.lock(`npc-freeze-${npc.id}`);

    if (!canProceed) {
      return;
    }

    const checkRange = random(12000, 14000);
    const interval = setInterval(async () => {
      await this.newRelic.trackTransaction(NewRelicTransactionCategory.Interval, "NPCFreezer", async () => {
        if (await this.shouldFreezeNPC(npc)) {
          await this.freezeNPC(npc);
          clearInterval(interval);
        }
      });
    }, checkRange);

    this.freezeCheckIntervals.set(npc.id, interval);
  }

  @TrackNewRelicTransaction()
  public async freezeNPC(npc: INPC, isForced?: boolean): Promise<void> {
    await this.locker.unlock(`npc-freeze-${npc.id}`);

    if (appEnv.general.ENV === EnvType.Development) {
      console.log(`Freezing NPC ${npc.key} (${npc.id}) ${isForced ? "(FORCED)" : ""}`);
    }

    await NPC.updateOne({ _id: npc._id, scene: npc.scene }, { isBehaviorEnabled: false });
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

  private setCPUUsageCheckInterval(): void {
    const start = CPUusage();
    const checkInterval = NPC_FREEZE_CHECK_INTERVAL;
    const maxCPUUsagePerInstance = 70;

    setInterval(async () => {
      const end = CPUusage(start);
      const totalCPUUsage = round(end.percent);

      console.log(
        `NPC_CYCLES: ${NPC_CYCLES.size} NPC_BATTLE_CYCLES: ${NPC_BATTLE_CYCLES.size} CPU_USAGE: ${totalCPUUsage}%`
      );

      const totalActiveNPCs = await NPC.countDocuments({ isBehaviorEnabled: true });
      const freezeTasks: any[] = [];

      if (totalActiveNPCs >= NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE) {
        const diff = totalActiveNPCs - NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE;
        for (let i = 0; i < diff; i++) {
          freezeTasks.push(this.freezeRandomNPC());
        }
      }

      if (totalCPUUsage >= maxCPUUsagePerInstance) {
        const freezeCount = Math.ceil(totalActiveNPCs * 0.3);
        for (let i = 0; i < freezeCount; i++) {
          freezeTasks.push(this.freezeRandomNPC());
        }
      }

      await Promise.all(freezeTasks);
    }, checkInterval);
  }

  @TrackNewRelicTransaction()
  private async shouldFreezeNPC(npc: INPC): Promise<boolean> {
    const nearbyCharacters = await this.npcView.getCharactersInView(npc);
    return nearbyCharacters.length === 0;
  }

  @TrackNewRelicTransaction()
  private async freezeRandomNPC(): Promise<void> {
    const npcIds = Array.from(NPC_CYCLES.keys());
    const randomNpcId = random(0, npcIds.length - 1);
    const npcCycle = NPC_CYCLES.get(npcIds[randomNpcId]);

    if (!npcCycle) {
      return;
    }

    const npc = await NPC.findById(npcCycle.id).lean().select("id _id key");
    if (npc) {
      try {
        await this.freezeNPC(npc as INPC, true);
      } catch (error) {
        console.error(`Failed to freeze NPC ${npcCycle.id}: ${error.message}`);
      }
    }
  }
}
