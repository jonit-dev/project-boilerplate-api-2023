/* eslint-disable no-void */
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NPCAlignment, NPCMovementType, NPCPathOrientation, ToGridX, ToGridY } from "@rpg-engine/shared";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Skill } from "@entities/ModuleCharacter/SkillsModel";
import {
  NPC_CYCLE_INTERVAL_RATIO,
  NPC_FRIENDLY_FREEZE_CHECK_CHANCE,
  NPC_MAX_ACTIVE_NPCS,
  NPC_MIN_DISTANCE_TO_ACTIVATE,
} from "@providers/constants/NPCConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { Promise } from "bluebird";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { NPCCycle, NPC_CYCLES } from "./NPCCycle";
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
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { PROMISE_DEFAULT_CONCURRENCY } from "@providers/constants/ServerConstants";
import { MathHelper } from "@providers/math/MathHelper";
import { RaidManager } from "@providers/raid/RaidManager";
import {
  NewRelicMetricCategory,
  NewRelicSubCategory,
  NewRelicTransactionCategory,
} from "@providers/types/NewRelicTypes";

@provide(NPCManager)
export class NPCManager {
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
    private specialEffect: SpecialEffect,
    private inMemoryHashTable: InMemoryHashTable,
    private newRelic: NewRelic,
    private mathHelper: MathHelper,
    private raidManager: RaidManager
  ) {}

  @TrackNewRelicTransaction()
  public async startNearbyNPCsBehaviorLoop(character: ICharacter): Promise<void> {
    const nearbyNPCs = await this.npcView.getNPCsInView(character, { isBehaviorEnabled: false });

    let totalActiveNPCs = await NPC.countDocuments({ isBehaviorEnabled: true });

    this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.NPCs, "Active", totalActiveNPCs);

    const behaviorLoops: Promise<void>[] = [];

    for (const npc of nearbyNPCs) {
      const distanceToCharacterInGrid = this.mathHelper.getDistanceInGridCells(npc.x, npc.y, character.x, character.y);

      if (distanceToCharacterInGrid > NPC_MIN_DISTANCE_TO_ACTIVATE) {
        continue;
      }

      if (totalActiveNPCs <= NPC_MAX_ACTIVE_NPCS) {
        // watch out for max NPCs active limit so we don't fry our CPU
        behaviorLoops.push(this.startBehaviorLoop(npc));
        totalActiveNPCs++;
      } else {
        break; // break out of the loop if we've reached max active NPCs
      }
    }

    await Promise.map(behaviorLoops, (behaviorLoop) => behaviorLoop, { concurrency: PROMISE_DEFAULT_CONCURRENCY });
  }

  @TrackNewRelicTransaction()
  public async startBehaviorLoop(initialNPC: INPC): Promise<void> {
    let npc = initialNPC;

    if (!npc) {
      return;
    }

    if (npc) {
      await this.inMemoryHashTable.set("npc", npc._id, npc);
    }

    const isRaidNPC = npc.raidKey !== undefined;

    const isRaidNPCActive = npc.raidKey && (await this.raidManager.isRaidActive(npc.raidKey!));

    if (isRaidNPC && !isRaidNPCActive) {
      return;
    }

    if (!npc.isBehaviorEnabled) {
      // prevent double behavior loop
      if (NPC_CYCLES.has(npc.id)) {
        return;
      }

      const npcSkills = await Skill.find({ owner: npc._id }).cacheQuery({
        cacheKey: `npc-${npc.id}-skills`,
      });

      new NPCCycle(
        npc.id,
        async () => {
          try {
            await this.newRelic.trackTransaction(
              NewRelicTransactionCategory.Operation,
              `NPCCycle/${npc.currentMovementType}`,
              async () => {
                npc = await NPC.findById(npc._id).lean({
                  virtuals: true,
                  defaults: true,
                });

                console.log("NPCCycle => ", npc.key);

                if (!npc.isBehaviorEnabled) {
                  await this.npcFreezer.freezeNPC(npc);
                  return;
                }

                await this.friendlyNPCFreezeCheck(npc);

                console.log(npc.targetCharacter);

                npc.skills = npcSkills;

                if (await this.specialEffect.isStun(npc)) {
                  return;
                }

                void this.startCoreNPCBehavior(npc);
              }
            );
          } catch (err) {
            console.log(`Error in ${npc.key}`);
            console.log(err);
          }
        },
        (1600 + random(0, 200)) / (npc.speed * 1.6) / NPC_CYCLE_INTERVAL_RATIO
      );
      await this.setNPCBehavior(npc, true);
    }
  }

  @TrackNewRelicTransaction()
  public async disableNPCBehaviors(): Promise<void> {
    await NPC.updateMany({}, { $set: { isBehaviorEnabled: false } }).lean();
  }

  @TrackNewRelicTransaction()
  public async setNPCBehavior(npc: INPC, value: boolean): Promise<void> {
    await NPC.updateOne({ _id: npc._id }, { $set: { isBehaviorEnabled: value } }).lean();
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
