import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { NPC_FREEZE_CHECK_INTERVAL, NPC_MAX_ACTIVE_NPC_PER_CHARACTER } from "@providers/constants/NPCConstants";
import { provideSingleton } from "@providers/inversify/provideSingleton";
import { MathHelper } from "@providers/math/MathHelper";
import { NPCAlignment } from "@rpg-engine/shared";
import CPUusage from "cpu-percentage";
import round from "lodash/round";
import { NPCView } from "./NPCView";

const MAX_CPU_USAGE_PER_INSTANCE = 60;

@provideSingleton(NPCFreezer)
export class NPCFreezer {
  constructor(private mathHelper: MathHelper, private npcView: NPCView) {}

  public init(): void {
    this.monitorNPCsAndFreezeIfNeeded();
  }

  @TrackNewRelicTransaction()
  public async freezeNPC(npc: INPC, reason?: string): Promise<void> {
    if (!npc.isBehaviorEnabled) {
      return;
    }

    console.log(`❄️ Freezing NPC ${npc.key} (${npc._id}) ${reason ? `- Reason: ${reason}` : ""}`);
    await NPC.updateOne(
      { _id: npc._id },
      {
        $set: {
          isBehaviorEnabled: false,
        },
        $unset: {
          targetCharacter: 1,
        },
      }
    );
  }

  @TrackNewRelicTransaction()
  public async freezeNPCsWithoutCharactersAround(): Promise<void> {
    const activeNPCs = await NPC.find({
      isBehaviorEnabled: true,
    });

    const inactiveNPCPromises: any[] = [];

    for (const npc of activeNPCs) {
      const charactersAround = await this.npcView.getCharactersInView(npc);

      if (charactersAround.length === 0) {
        inactiveNPCPromises.push(this.freezeNPC(npc, "NPCFreezer - No characters around"));
      }
    }

    await Promise.all(inactiveNPCPromises);
  }

  @TrackNewRelicTransaction()
  public async maxActiveNPCs(): Promise<number> {
    const onlineCharacters = await Character.countDocuments({ isOnline: true });

    return onlineCharacters * NPC_MAX_ACTIVE_NPC_PER_CHARACTER;
  }

  private monitorNPCsAndFreezeIfNeeded(): void {
    setInterval(async () => {
      const totalCPUUsage = round(CPUusage().percent);
      const totalActiveNPCs = await NPC.countDocuments({ isBehaviorEnabled: true });

      const freezeTasks: any[] = [];

      const maxActiveNPCs = await this.maxActiveNPCs();

      // Try to freeze some friendly NPCs first
      if (totalActiveNPCs >= maxActiveNPCs * 0.7) {
        const friendlyNPCs = await NPC.find({
          alignment: NPCAlignment.Friendly,
          isBehaviorEnabled: true,
          hasDepot: { $ne: true },
          hasQuest: {
            $ne: true,
          },
        }).lean();
        for (const npc of friendlyNPCs) {
          freezeTasks.push(this.freezeNPC(npc as INPC, "NPCFreezer - Friendly NPC freeze"));
        }
      }

      // Check based on NPC count or CPU usage
      if (totalCPUUsage >= MAX_CPU_USAGE_PER_INSTANCE || (totalActiveNPCs >= 20 && totalActiveNPCs >= maxActiveNPCs)) {
        const freezeFactor = 0.3;
        const freezeCount = Math.ceil(totalActiveNPCs * freezeFactor);
        for (let i = 0; i < freezeCount; i++) {
          freezeTasks.push(this.freezeFarthestTargetingNPC());
        }
      }

      console.log(`TOTAL_ACTIVE_NPCS: ${totalActiveNPCs} / MAX_ACTIVE_NPCS: ${maxActiveNPCs} - CPU: ${totalCPUUsage}%`);
      await Promise.all(freezeTasks);
    }, NPC_FREEZE_CHECK_INTERVAL);
  }

  @TrackNewRelicTransaction()
  private async freezeFarthestTargetingNPC(): Promise<void> {
    const npcs = await NPC.find({
      isBehaviorEnabled: true,
      targetCharacter: { $exists: true },
    })
      .lean()
      .select("key x y targetCharacter scene");

    const targetCharacterIds = npcs.map((npc) => npc.targetCharacter);
    const characters = await Character.find({ _id: { $in: targetCharacterIds } }).lean();

    let maxDistance = -Infinity;
    let npcToFreeze;

    for (const npc of npcs) {
      const targetCharacter = characters.find((character) => String(character._id) === String(npc.targetCharacter));

      if (!targetCharacter) continue;

      const distance = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, targetCharacter.x, targetCharacter.y);
      if (distance > maxDistance) {
        maxDistance = distance;
        npcToFreeze = npc;
      }
    }

    if (npcToFreeze) {
      console.log(`❄️ Freezing farthest targeted NPC ${npcToFreeze.key} (${npcToFreeze._id})`);
      try {
        await this.freezeNPC(npcToFreeze as INPC, "NPCFreezer - Farthest targeting NPC freeze");
      } catch (error) {
        console.error(`Failed to freeze NPC ${npcToFreeze.id}: ${error.message}`);
      }
    }
  }
}
