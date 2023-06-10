/* eslint-disable no-void */
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NPCMovementType, NPCPathOrientation, ToGridX, ToGridY } from "@rpg-engine/shared";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import { NPC_CYCLE_INTERVAL_RATIO, NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE } from "@providers/constants/NPCConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { PM2Helper } from "@providers/server/PM2Helper";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { NPCCycle } from "./NPCCycle";
import { NPCFreezer } from "./NPCFreezer";
import { NPCLoader } from "./NPCLoader";
import { NPCView } from "./NPCView";
import { NPCMovement } from "./movement/NPCMovement";
import { NPCMovementFixedPath } from "./movement/NPCMovementFixedPath";
import { NPCMovementMoveAway } from "./movement/NPCMovementMoveAway";
import { NPCMovementMoveTowards } from "./movement/NPCMovementMoveTowards";
import { NPCMovementRandomPath } from "./movement/NPCMovementRandomPath";
import { NPCMovementStopped } from "./movement/NPCMovementStopped";

import { NewRelic } from "@providers/analytics/NewRelic";
import { NewRelicMetricCategory, NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";

import { appEnv } from "@providers/config/env";
import { Queue, Worker } from "bullmq";

@provide(NPCManager)
export class NPCManager {
  private queue: Queue;
  private worker: Worker;

  constructor(
    private npcMovement: NPCMovement,
    private npcMovementFixedPath: NPCMovementFixedPath,
    private npcMovementRandom: NPCMovementRandomPath,
    private npcMovementMoveTowards: NPCMovementMoveTowards,
    private npcMovementStopped: NPCMovementStopped,
    private npcMovementMoveAway: NPCMovementMoveAway,
    private npcView: NPCView,
    private npcLoader: NPCLoader,
    private npcFreezer: NPCFreezer,
    private pm2Helper: PM2Helper,
    private specialEffect: SpecialEffect,
    private inMemoryHashTable: InMemoryHashTable,

    private newRelic: NewRelic
  ) {
    this.queue = new Queue("NPCStartBehaviorLoop", {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      "NPCStartBehaviorLoop",
      async (job) => {
        let { npc, npcSkills } = job.data;

        try {
          this.npcFreezer.tryToFreezeNPC(npc);

          npc = await NPC.findById(npc._id).lean({
            virtuals: true,
            defaults: true,
          });

          npc.skills = npcSkills;

          if (!npc.isBehaviorEnabled) {
            await this.npcFreezer.freezeNPC(npc);
            return;
          }

          if (await this.specialEffect.isStun(npc)) {
            return;
          }

          void this.startCoreNPCBehavior(npc);
        } catch (error) {
          console.error(error);
        }
      },

      {
        connection: {
          host: appEnv.database.REDIS_CONTAINER,
          port: Number(appEnv.database.REDIS_PORT),
        },
      }
    );

    this.worker.on("failed", (job, err) => {
      console.log(`Job ${job?.id} failed with error ${err.message}`);
    });
  }

  public listenForBehaviorTrigger(): void {
    process.on("message", async (data) => {
      const totalActiveNPCs = await NPC.countDocuments({ isBehaviorEnabled: true });

      // if we still have room for more NPCs, start the behavior loop, if not, just repass the signal to another pm2 instance
      if (totalActiveNPCs <= NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE) {
        if (data.type === "startNPCBehavior") {
          const randomN = random(0, 3000);

          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            this.startNearbyNPCsBehaviorLoop(data.data.character);
          }, randomN);
        }
      } else {
        this.pm2Helper.sendEventToRandomCPUInstance("startNPCBehavior", { character: data.data.character });
      }
    });
  }

  public async startNearbyNPCsBehaviorLoop(character: ICharacter): Promise<void> {
    const nearbyNPCs = await this.npcView.getNPCsInView(character, { isBehaviorEnabled: false });
    for (const npc of nearbyNPCs) {
      const totalActiveNPCs = await NPC.countDocuments({ isBehaviorEnabled: true });

      this.newRelic.trackMetric(NewRelicMetricCategory.Count, "NPCs/Active", totalActiveNPCs);

      if (totalActiveNPCs <= NPC_MAX_SIMULTANEOUS_ACTIVE_PER_INSTANCE) {
        // watch out for max NPCs active limit so we don't fry our CPU

        void this.startBehaviorLoop(npc);

        // wait 200 ms
        await new Promise((resolve) => setTimeout(resolve, 25));
      }
    }
  }

  public async startBehaviorLoop(initialNPC: INPC): Promise<void> {
    const npc = initialNPC;

    if (npc) {
      await this.inMemoryHashTable.set("npc", npc._id, npc);
    }

    if (!npc.isBehaviorEnabled) {
      const npcSkills = await Skill.findOne({ owner: npc._id })
        .lean()
        .cacheQuery({
          cacheKey: `${npc.id}-skills`,
          ttl: 60 * 60 * 24 * 7,
        });

      new NPCCycle(
        npc.id,
        () => {
          try {
            this.newRelic.trackTransaction(
              NewRelicTransactionCategory.Operation,
              `NPCCycle/${npc.currentMovementType}`,
              async () => {
                await this.queue.add("NPCStartBehaviorLoop", { npc, npcSkills }, { removeOnComplete: true });
              }
            );
          } catch (err) {
            console.log(`Error in ${npc.key}`);
            console.log(err);
          }
        },
        (1600 + random(0, 200)) / (npc.speed * 1.6) / NPC_CYCLE_INTERVAL_RATIO
      );
    }
    await this.setNPCBehavior(npc, true);
  }

  public async disableNPCBehaviors(): Promise<void> {
    await NPC.updateMany({}, { $set: { isBehaviorEnabled: false } });
  }

  public async setNPCBehavior(npc: INPC, value: boolean): Promise<void> {
    await NPC.updateOne({ _id: npc._id }, { $set: { isBehaviorEnabled: value } });
  }

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

        const npcSeedData = this.npcLoader.loadNPCSeedData();

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
