import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { BattleAttackTarget } from "@providers/battle/BattleAttackTarget/BattleAttackTarget";
import { appEnv } from "@providers/config/env";
import { NPC_BATTLE_CYCLE_INTERVAL, NPC_MIN_DISTANCE_TO_ACTIVATE } from "@providers/constants/NPCConstants";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { Locker } from "@providers/locks/Locker";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import { NPCAlignment } from "@rpg-engine/shared";
import { Queue, Worker } from "bullmq";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCView } from "./NPCView";
import { ICharacterHealth } from "./movement/NPCMovementMoveTowards";
import { NPCTarget } from "./movement/NPCTarget";

@provide(NPCBattleCycleQueue)
export class NPCBattleCycleQueue {
  private queue: Queue<any, any, string>;
  private worker: Worker;
  private queueConfig = {
    delay: NPC_BATTLE_CYCLE_INTERVAL,
    removeOnComplete: true,
    removeOnFail: true,
  };

  constructor(
    private newRelic: NewRelic,
    private locker: Locker,
    private npcTarget: NPCTarget,
    private specialEffect: SpecialEffect,
    private movementHelper: MovementHelper,
    private battleAttackTarget: BattleAttackTarget,
    private npcView: NPCView
  ) {
    this.queue = new Queue("npc-battle-cycle-queue", {
      connection: {
        host: appEnv.database.REDIS_CONTAINER,
        port: Number(appEnv.database.REDIS_PORT),
      },
    });

    this.worker = new Worker(
      "npc-battle-cycle-queue",
      async (job) => {
        const { npc, npcSkills } = job.data;

        try {
          await this.execBattleCycle(npc, npcSkills);
        } catch (err) {
          console.error(`Error processing npc-battle-cycle-queue for NPC ${npc.key}:`, err);
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
        console.log(`npc-battle-cycle-queue job ${job?.id} failed with error ${err.message}`);
      });

      this.queue.on("error", (error) => {
        console.error("Error in the npc-battle-cycle-queue :", error);
      });
    }
  }

  public async add(npc: INPC, npcSkills: ISkill): Promise<void> {
    if (appEnv.general.IS_UNIT_TEST) {
      await this.execBattleCycle(npc, npcSkills);
      return;
    }

    await this.queue.add(
      "npc-battle-cycle-queue",
      {
        npc,
        npcSkills,
      },
      this.queueConfig
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

  private async execBattleCycle(npc: INPC, npcSkills: ISkill): Promise<void> {
    console.log(`NPC ${npc.key} (${npc.id}) battle cycle`);

    const hasLock = await this.locker.hasLock(`npc-${npc._id}-npc-battle-cycle`);

    if (!hasLock) {
      return;
    }

    this.newRelic.trackMetric(NewRelicMetricCategory.Count, NewRelicSubCategory.NPCs, "NPCBattleCycle", 1);

    const result = await Promise.all([
      NPC.findById(npc.id).lean({ virtuals: true, defaults: true }),
      Character.findById(npc.targetCharacter).lean({ virtuals: true, defaults: true }),
    ]);

    const targetCharacter = result[1] as ICharacter;

    const isUnderRange = this.movementHelper.isUnderRange(
      npc.x,
      npc.y,
      targetCharacter.x,
      targetCharacter.y,
      npc.maxRangeInGridCells || NPC_MIN_DISTANCE_TO_ACTIVATE
    );

    if (!targetCharacter || targetCharacter.health <= 0 || targetCharacter.scene !== npc.scene || !isUnderRange) {
      await this.stop(npc);
      return;
    }

    const updatedNPC = result[0] as INPC;
    updatedNPC.skills = npcSkills;

    if (!updatedNPC.isBehaviorEnabled) {
      await this.stop(npc);
      return;
    }

    const hasNoTarget = !updatedNPC.targetCharacter?.toString();
    const hasDifferentTarget = updatedNPC.targetCharacter?.toString() !== targetCharacter?.id;

    if (hasNoTarget || hasDifferentTarget || !targetCharacter) {
      await this.stop(npc);
      return;
    }

    const characterSkills = (await Skill.findOne({
      owner: targetCharacter._id,
    })
      .lean()
      .cacheQuery({
        cacheKey: `${targetCharacter._id}-skills`,
      })) as ISkill;

    targetCharacter.skills = characterSkills;

    const isTargetInvisible = await this.specialEffect.isInvisible(targetCharacter);

    if (
      updatedNPC?.alignment === NPCAlignment.Hostile &&
      targetCharacter?.health > 0 &&
      updatedNPC.health > 0 &&
      !isTargetInvisible
    ) {
      // if reached target and alignment is enemy, lets hit it
      await this.battleAttackTarget.checkRangeAndAttack(updatedNPC, targetCharacter);
      await this.tryToSwitchToRandomTarget(npc);
    }

    await this.add(updatedNPC, npcSkills);
  }

  private async stop(npc: INPC): Promise<void> {
    await this.npcTarget.clearTarget(npc);
    await this.locker.unlock(`npc-${npc._id}-npc-battle-cycle`);
  }

  @TrackNewRelicTransaction()
  private async tryToSwitchToRandomTarget(npc: INPC): Promise<boolean> {
    if (npc.canSwitchToLowHealthTarget || npc.canSwitchToRandomTarget) {
      // Odds have failed, we will not change target
      if (!this.checkOdds()) return false;

      const nearbyCharacters = await this.getVisibleCharactersInView(npc);
      // Only one character around this NPC, cannot change target
      if (nearbyCharacters.length <= 1) return false;
      let alreadySet = false;

      if (npc.canSwitchToLowHealthTarget) {
        const charactersHealth: ICharacterHealth[] = [];
        for (const nearbyCharacter of nearbyCharacters) {
          if (!nearbyCharacter.isAlive) {
            continue;
          }

          charactersHealth.push({
            id: nearbyCharacter.id,
            health: nearbyCharacter.health,
          });
        }

        const minHealthCharacterInfo = _.minBy(charactersHealth, "health");
        const minHealthCharacter = (await Character.findById(minHealthCharacterInfo?.id).lean()) as ICharacter;

        // Only set as target if the minimum health character is with 25% of it's health
        if (minHealthCharacter.health <= minHealthCharacter.maxHealth / 4) {
          await this.npcTarget.setTarget(npc, minHealthCharacter);
          npc.speed += npc.speed * 0.3;
          alreadySet = true;
          return true;
        }
      }

      if (npc.canSwitchToRandomTarget && !alreadySet) {
        const randomCharacter = _.sample(nearbyCharacters);
        if (randomCharacter) await this.npcTarget.setTarget(npc, randomCharacter);
        return true;
      }
    }

    return false;
  }

  private checkOdds(): boolean {
    const random = Math.random();

    // Always have a 10% chance of returning true
    if (random < 0.1) return true;

    return false;
  }

  @TrackNewRelicTransaction()
  private async getVisibleCharactersInView(npc: INPC): Promise<ICharacter[]> {
    const chars = await this.npcView.getCharactersInView(npc);
    const visible: ICharacter[] = [];
    for (const c of chars) {
      if (!(await this.specialEffect.isInvisible(c))) {
        visible.push(c);
      }
    }
    return visible;
  }
}
