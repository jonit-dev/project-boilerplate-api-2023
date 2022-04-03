import { INPC, NPC } from "@entities/ModuleSystem/NPCModel";
import { appEnv } from "@providers/config/env";
import { EnvType, FixedPathOrientation, NPCMovementType, SocketTypes, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCMovement } from "./movement/NPCMovement";
import { NPCMovementFixedPath } from "./movement/NPCMovementFixedPath";
import { NPCMovementMoveAway } from "./movement/NPCMovementMoveAway";
import { NPCMovementMoveTowards } from "./movement/NPCMovementMoveTowards";
import { NPCMovementRandomPath } from "./movement/NPCMovementRandomPath";
import { NPCMovementStopped } from "./movement/NPCMovementStopped";
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
    private npcView: NPCView
  ) {}

  public async init(): Promise<void> {
    const npcs = await NPC.find({});
    switch (appEnv.general.ENV) {
      case EnvType.Development: // on development, start all NPCs at once.
        for (const npc of npcs) {
          this.startBehaviorLoop(npc);
        }
        break;

      case EnvType.Production: // on production, spread NPCs over pm2 instances.
        switch (appEnv.socket.type) {
          case SocketTypes.TCP:
            for (const npc of npcs) {
              if (process.env.NODE_APP_INSTANCE === npc.pm2InstanceManager.toString()) {
                this.startBehaviorLoop(npc);
              }
            }
            break;

          case SocketTypes.UDP:
            if (process.env.NODE_APP_INSTANCE === "0") {
              for (const npc of npcs) {
                this.startBehaviorLoop(npc);
              }
            }
            break;
        }

        break;
    }
  }

  public startBehaviorLoop(npc: INPC): void {
    setInterval(async () => {
      try {
        // check if actually there's a character near. If not, let's not waste server resources!

        const nearbyCharacters = await this.npcView.getCharactersInView(npc);

        if (!nearbyCharacters.length) {
          return; // no character in view, no need to waste resources!
        }

        switch (npc.movementType) {
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
            const npcData = NPCLoader.NPCMetaData.get(npc.key);

            if (!npcData) {
              console.log(`Failed to find NPC data for ${npc.key}`);
              return;
            }

            // if NPC is at the initial position, move forward to end position.
            if (this.npcMovement.isNPCAtPathPosition(npc, ToGridX(npcData.x!), ToGridY(npcData.y!))) {
              npc.fixedPathOrientation = FixedPathOrientation.Forward;
              await npc.save();
            }

            // if NPC is at the end of the path, move backwards to initial position.
            if (this.npcMovement.isNPCAtPathPosition(npc, endGridX, endGridY)) {
              npc.fixedPathOrientation = FixedPathOrientation.Backward;
              await npc.save();
            }

            if (npc.fixedPathOrientation === FixedPathOrientation.Backward) {
              endGridX = ToGridX(npcData?.x!);
              endGridY = ToGridY(npcData?.y!);
            }

            await this.npcMovementFixedPath.startFixedPathMovement(npc, endGridX, endGridY);

            break;
        }
      } catch (err) {
        console.log(`Error in ${npc.key}`);
        console.log(err);
      }
    }, _.random(1000, 2000));
  }
}
