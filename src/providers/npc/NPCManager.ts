import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NPCMovementType, NPCPathOrientation, ToGridX, ToGridY } from "@rpg-engine/shared";

import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
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
    private npcFreezer: NPCFreezer
  ) {}

  public listenForBehaviorTrigger(): void {
    process.on("message", async (data) => {
      if (data.type === "startNPCBehavior") {
        await this.startNearbyNPCsBehaviorLoop(data.data.character);
      }
    });
  }

  public async startNearbyNPCsBehaviorLoop(character: ICharacter): Promise<void> {
    const nearbyNPCs = await this.npcView.getNPCsInView(character);

    for (const npc of nearbyNPCs) {
      if (npc.isBehaviorEnabled) {
        // void starting a new behavior loop if it's already enabled
        continue;
      }

      await this.startBehaviorLoop(npc);
    }
  }

  public async startBehaviorLoop(initialNPC: INPC): Promise<void> {
    let npc = initialNPC;

    if (!npc.isBehaviorEnabled) {
      new NPCCycle(
        npc.id,
        async () => {
          try {
            npc = (await NPC.findById(initialNPC._id).populate("skills")) || initialNPC;

            await this.startCoreNPCBehavior(npc);
          } catch (err) {
            console.log(`Error in ${npc.key}`);
            console.log(err);
          }
        },
        (1500 + random(0, 200)) / npc.speed
      );
    }

    await this.setNPCBehavior(npc, true);

    this.npcFreezer.tryToFreezeNPC(npc);
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
        await this.npcMovementMoveAway.startMovementMoveAway(npc);
        break;

      case NPCMovementType.Stopped:
        await this.npcMovementStopped.startMovementStopped(npc);
        break;

      case NPCMovementType.MoveTowards:
        await this.npcMovementMoveTowards.startMoveTowardsMovement(npc);
        break;

      case NPCMovementType.Random:
        await this.npcMovementRandom.startRandomMovement(npc);
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
