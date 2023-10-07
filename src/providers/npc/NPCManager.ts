/* eslint-disable no-void */
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { NPC_MAX_ACTIVE_NPCS, NPC_MIN_DISTANCE_TO_ACTIVATE } from "@providers/constants/NPCConstants";
import { InMemoryHashTable } from "@providers/database/InMemoryHashTable";
import { Promise } from "bluebird";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "./NPCView";

import { NewRelic } from "@providers/analytics/NewRelic";
import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { PROMISE_DEFAULT_CONCURRENCY } from "@providers/constants/ServerConstants";
import { Locker } from "@providers/locks/Locker";
import { MathHelper } from "@providers/math/MathHelper";
import { RaidManager } from "@providers/raid/RaidManager";
import { NewRelicMetricCategory, NewRelicSubCategory } from "@providers/types/NewRelicTypes";
import { NPCCycleQueue } from "./NPCCycleQueue";

@provide(NPCManager)
export class NPCManager {
  constructor(
    private npcView: NPCView,
    private inMemoryHashTable: InMemoryHashTable,
    private newRelic: NewRelic,
    private mathHelper: MathHelper,
    private raidManager: RaidManager,
    private npcCycleQueue: NPCCycleQueue,
    private locker: Locker
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
    const npc = initialNPC;

    if (!npc) {
      return;
    }

    const canProceed = await this.locker.lock(`npc-${npc._id}-npc-cycle`);

    if (!canProceed) {
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

      const npcSkills = (await Skill.find({ owner: npc._id }).cacheQuery({
        cacheKey: `npc-${npc.id}-skills`,
      })) as unknown as ISkill;

      await this.npcCycleQueue.add(npc, npcSkills);

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
}
