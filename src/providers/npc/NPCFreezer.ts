/* eslint-disable no-undef */
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { provideSingleton } from "@providers/inversify/provideSingleton";

import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { NPC_FREEZE_CHECK_INTERVAL, NPC_MAX_ACTIVE_NPCS } from "@providers/constants/NPCConstants";
import { MathHelper } from "@providers/math/MathHelper";
import { EnvType, NPCAlignment } from "@rpg-engine/shared";
import CPUusage from "cpu-percentage";
import round from "lodash/round";

@provideSingleton(NPCFreezer)
export class NPCFreezer {
  constructor(private mathHelper: MathHelper) {}

  public init(): void {
    this.setCPUUsageCheckInterval();
  }

  @TrackNewRelicTransaction()
  public async freezeNPC(npc: INPC, isForced?: boolean): Promise<void> {
    if (appEnv.general.ENV === EnvType.Development) {
      console.log(`Freezing NPC ${npc.key} (${npc._id}) ${isForced ? "(FORCED)" : ""}`);
    }

    await NPC.updateOne(
      { _id: npc._id },
      {
        isBehaviorEnabled: false,
      }
    );
  }

  private setCPUUsageCheckInterval(): void {
    const start = CPUusage();
    const checkInterval = NPC_FREEZE_CHECK_INTERVAL;
    const maxCPUUsagePerInstance = 55;

    setInterval(async () => {
      const end = CPUusage(start);
      const totalCPUUsage = round(end.percent);

      const totalActiveNPCs = await NPC.countDocuments({ isBehaviorEnabled: true });
      const freezeTasks: any[] = [];

      if (totalActiveNPCs >= NPC_MAX_ACTIVE_NPCS) {
        const freezeCount = Math.ceil(totalActiveNPCs * 0.2);

        for (let i = 0; i < freezeCount; i++) {
          freezeTasks.push(this.freezeFarthestTargetingNPC());
        }
      }

      if (totalCPUUsage >= maxCPUUsagePerInstance) {
        const freezeCount = Math.ceil(totalActiveNPCs * 0.3);
        for (let i = 0; i < freezeCount; i++) {
          freezeTasks.push(this.freezeFarthestTargetingNPC());
        }
      }

      if (totalActiveNPCs >= NPC_MAX_ACTIVE_NPCS * 0.7) {
        const friendlyNPCs = await NPC.find({ alignment: NPCAlignment.Friendly, isBehaviorEnabled: true }).lean();

        for (const npc of friendlyNPCs) {
          freezeTasks.push(this.freezeNPC(npc as INPC));
        }
      }

      console.log(`TOTAL_ACTIVE_NPCS: ${totalActiveNPCs} - CPU: ${totalCPUUsage}%`);

      await Promise.all(freezeTasks);
    }, checkInterval);
  }

  @TrackNewRelicTransaction()
  private async freezeFarthestTargetingNPC(): Promise<void> {
    const npcs = await NPC.find({
      isBehaviorEnabled: true,
      targetCharacter: {
        $exists: true,
      },
    })
      .lean()
      .select("key x y targetCharacter scene");

    // Batch retrieve all target characters in one go
    const targetCharacterIds = npcs.map((npc) => npc.targetCharacter);
    const characters = await Character.find({ _id: { $in: targetCharacterIds } }).lean();

    // Use a map for quick lookup of character by ID

    let maxDistance = -Infinity;
    let npcToFreeze;

    for (const npc of npcs) {
      const targetCharacter = characters.find((character) => String(character._id) === String(npc.targetCharacter));

      if (!targetCharacter) {
        continue;
      }

      const distance = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, targetCharacter.x, targetCharacter.y);

      // Update if we find a greater distance
      if (distance > maxDistance) {
        maxDistance = distance;
        npcToFreeze = npc;
      }
    }

    if (npcToFreeze) {
      try {
        await this.freezeNPC(npcToFreeze as INPC, true);
      } catch (error) {
        console.error(`Failed to freeze NPC ${npcToFreeze.id}: ${error.message}`);
      }
    }
  }
}
