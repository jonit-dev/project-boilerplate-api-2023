import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { appEnv } from "@providers/config/env";
import { NPC_CYCLE_INTERVAL_RATIO, NPC_FRIENDLY_FREEZE_CHECK_CHANCE } from "@providers/constants/NPCConstants";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { NPCAlignment, NPCMovementType, NPCPathOrientation, ToGridX, ToGridY } from "@rpg-engine/shared";
import { Queue, Worker } from "bullmq";
import { provide } from "inversify-binding-decorators";
import { random } from "lodash";
import { NPCFreezer } from "./NPCFreezer";
import { NPCLoader } from "./NPCLoader";
import { NPCView } from "./NPCView";
import { NPCMovement } from "./movement/NPCMovement";
import { NPCMovementFixedPath } from "./movement/NPCMovementFixedPath";
import { NPCMovementMoveAway } from "./movement/NPCMovementMoveAway";
import { NPCMovementMoveTowards } from "./movement/NPCMovementMoveTowards";
import { NPCMovementRandomPath } from "./movement/NPCMovementRandomPath";
import { NPCMovementStopped } from "./movement/NPCMovementStopped";

@provide(NPCCycleQueue)
export class NPCCycleQueue {
  private queue: Queue<any, any, string>;
  private worker: Worker;

  constructor(
    private specialEffect: SpecialEffect,
    private npcView: NPCView,
    private npcFreezer: NPCFreezer,
    private npcMovement: NPCMovement,
    private npcMovementFixedPath: NPCMovementFixedPath,
    private npcMovementRandom: NPCMovementRandomPath,
    private npcMovementMoveTowards: NPCMovementMoveTowards,
    private npcMovementStopped: NPCMovementStopped,
    private npcMovementMoveAway: NPCMovementMoveAway,
    private npcLoader: NPCLoader
  ) {
    this.queue = new Queue("npc-cycle-queue", {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      "npc-cycle-queue",
      async (job) => {
        const { npc, npcSkills, isFirstCycle } = job.data;

        try {
          await this.execNpcCycle(npc, npcSkills, isFirstCycle);
        } catch (err) {
          console.error(`Error processing npc-cycle-queue for NPC ${npc.key}:`, err);
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

    if (!appEnv.general.IS_UNIT_TEST) {
      this.worker.on("failed", (job, err) => {
        console.log(`npc-cycle-queue job ${job?.id} failed with error ${err.message}`);
      });

      this.queue.on("error", (error) => {
        console.error("Error in the npc-cycle-queue :", error);
      });
    }
  }

  public async add(npc: INPC, npcSkills: ISkill, isFirstCycle = true): Promise<void> {
    if (appEnv.general.IS_UNIT_TEST) {
      await this.execNpcCycle(npc, npcSkills, true);
      return;
    }

    await this.queue.add(
      "npc-cycle-queue",
      {
        npc,
        npcSkills,
        isFirstCycle,
      },
      {
        delay: (1600 + random(0, 200)) / (npc.speed * 1.6) / NPC_CYCLE_INTERVAL_RATIO,
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
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

  private async execNpcCycle(npc: INPC, npcSkills: ISkill, isFirstCycle: boolean): Promise<void> {
    npc = await NPC.findById(npc._id).lean({
      virtuals: true,
      defaults: true,
    });

    console.log(`NPC ${npc.key} is executing cycle`);

    const shouldNPCBeCleared = this.shouldNPCBeCleared(npc);

    if (shouldNPCBeCleared) {
      await this.stop(npc);
      return;
    }

    if (!isFirstCycle && npc.alignment === NPCAlignment.Hostile && !npc.targetCharacter) {
      await this.stop(npc);
      return;
    }

    await this.friendlyNPCFreezeCheck(npc);

    npc.skills = npcSkills;

    if (await this.specialEffect.isStun(npc)) {
      return;
    }

    void this.startCoreNPCBehavior(npc);

    await this.add(npc, npcSkills, false);
  }

  private async stop(npc: INPC): Promise<void> {
    await Character.updateOne({ _id: npc.targetCharacter }, { $unset: { target: 1 } });
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

  private shouldNPCBeCleared(npc: INPC): boolean {
    if (!npc) return true;

    if (!npc.isBehaviorEnabled || npc.health <= 0) return true;

    return false;
  }

  @TrackNewRelicTransaction()
  private async friendlyNPCFreezeCheck(npc: INPC): Promise<void> {
    if (npc.alignment === NPCAlignment.Friendly) {
      const n = random(0, 100);

      if (n <= NPC_FRIENDLY_FREEZE_CHECK_CHANCE) {
        const nearbyCharacters = await this.npcView.getCharactersInView(npc);
        if (!nearbyCharacters.length) {
          await this.npcFreezer.freezeNPC(npc);
        }
      }
    }
  }

  @TrackNewRelicTransaction()
  private async startCoreNPCBehavior(npc: INPC): Promise<void> {
    switch (npc.currentMovementType) {
      case NPCMovementType.MoveAway:
        void this.npcMovementMoveAway.startMovementMoveAway(npc);
        break;

      case NPCMovementType.Stopped:
        void this.npcMovementStopped.startMovementStopped(npc);
        break;

      case NPCMovementType.MoveTowards:
        void this.npcMovementMoveTowards.startMoveTowardsMovement(npc);

        break;

      case NPCMovementType.Random:
        void this.npcMovementRandom.startRandomMovement(npc);
        break;
      case NPCMovementType.FixedPath:
        let endGridX = npc.fixedPath.endGridX as unknown as number;
        let endGridY = npc.fixedPath.endGridY as unknown as number;

        const npcSeedData = await this.npcLoader.loadNPCSeedData();

        const npcData = npcSeedData.get(npc.key);

        if (!npcData) {
          console.log(`Failed to find NPC data for ${npc.key}`);
          return;
        }

        // if NPC is at the initial position, move forward to end position.
        if (this.npcMovement.isNPCAtPathPosition(npc, ToGridX(npcData.x!), ToGridY(npcData.y!))) {
          await NPC.updateOne(
            { _id: npc._id },
            {
              $set: {
                pathOrientation: NPCPathOrientation.Forward,
              },
            }
          );
        }

        // if NPC is at the end of the path, move backwards to initial position.
        if (this.npcMovement.isNPCAtPathPosition(npc, endGridX, endGridY)) {
          await NPC.updateOne(
            { _id: npc._id },
            {
              $set: {
                pathOrientation: NPCPathOrientation.Backward,
              },
            }
          );
        }

        if (npc.pathOrientation === NPCPathOrientation.Backward) {
          endGridX = ToGridX(npcData?.x!);
          endGridY = ToGridY(npcData?.y!);
        }

        await this.npcMovementFixedPath.startFixedPathMovement(npc, endGridX, endGridY);

        break;
    }
  }
}
