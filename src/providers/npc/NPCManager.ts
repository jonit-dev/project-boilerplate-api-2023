import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NPCMovementType, NPCPathOrientation, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCMovement } from "./movement/NPCMovement";
import { NPCMovementFixedPath } from "./movement/NPCMovementFixedPath";
import { NPCMovementMoveAway } from "./movement/NPCMovementMoveAway";
import { NPCMovementMoveTowards } from "./movement/NPCMovementMoveTowards";
import { NPCMovementRandomPath } from "./movement/NPCMovementRandomPath";
import { NPCMovementStopped } from "./movement/NPCMovementStopped";
import { NPCCycle } from "./NPCCycle";
import { NPCLoader } from "./NPCLoader";
import { NPCView } from "./NPCView";

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
    private npcLoader: NPCLoader
  ) {}

  public async startNearbyNPCsBehaviorLoop(character: ICharacter): Promise<void> {
    // start behavior loop in all NPCs nearby
    const nearbyNPCs = await this.npcView.getNPCsInView(character);

    for (const npc of nearbyNPCs) {
      // if it has no NPC cycle already...
      if (NPCCycle.npcCycles.has(npc.id)) {
        continue;
      }

      this.startBehaviorLoop(npc);
    }
  }

  public startBehaviorLoop(initialNPC: INPC): void {
    let npc = initialNPC;

    new NPCCycle(
      npc.id,
      async () => {
        try {
          // check if actually there's a character near. If not, let's not waste server resources!

          npc = (await NPC.findById(initialNPC._id).populate("skills")) || initialNPC; // update npc instance on each behavior loop!

          await this.startCoreNPCBehavior(npc);
        } catch (err) {
          console.log(`Error in ${npc.key}`);
          console.log(err);
        }
      },
      3000 / npc.speed
    );

    // every 5-10 seconds, check if theres a character nearby. If not, shut down NPCCycle.
    const checkRange = _.random(5000, 10000);

    const interval = setInterval(async () => {
      const nearbyCharacters = await this.npcView.getCharactersInView(npc);

      if (nearbyCharacters.length === 0) {
        NPCCycle.npcCycles.delete(npc.id);
        clearInterval(interval);
      }
    }, checkRange);
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
