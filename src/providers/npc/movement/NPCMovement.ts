import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { GridManager } from "@providers/map/GridManager";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { INPCPositionUpdatePayload, NPCAlignment, NPCSocketEvents, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "../NPCView";
import { NPCWarn } from "../NPCWarn";
import { NPCTarget } from "./NPCTarget";

export type NPCDirection = "up" | "down" | "left" | "right";

interface IShortestPathPositionResult {
  newGridX: number;
  newGridY: number;
  nextMovementDirection: NPCDirection;
}

@provide(NPCMovement)
export class NPCMovement {
  constructor(
    private socketMessaging: SocketMessaging,
    private npcView: NPCView,
    private movementHelper: MovementHelper,
    private gridManager: GridManager,
    private mapNonPVPZone: MapNonPVPZone,
    private npcTarget: NPCTarget,
    private characterView: CharacterView,
    private npcWarn: NPCWarn
  ) {}

  public isNPCAtPathPosition(npc: INPC, gridX: number, gridY: number): boolean {
    if (ToGridX(npc.x) === gridX && ToGridY(npc.y) === gridY) {
      return true;
    }

    return false;
  }

  public async moveNPC(
    npc: INPC,
    oldX: number,
    oldY: number,
    newX: number,
    newY: number,
    chosenMovementDirection: NPCDirection
  ): Promise<void> {
    try {
      const map = npc.scene;

      const newGridX = ToGridX(newX);
      const newGridY = ToGridY(newY);

      // check if max range is reached
      const hasSolid = await this.movementHelper.isSolid(
        map,
        newGridX,
        newGridY,
        npc.layer,
        "CHECK_ALL_LAYERS_BELOW",
        npc
      );
      const { gridOffsetX, gridOffsetY } = this.gridManager.getMapOffset(map)!;

      if (hasSolid) {
        // console.log(`${npc.key} tried to move to ${newGridX}, ${newGridY}, but it's solid`);
        await this.gridManager.setWalkable(map, ToGridX(newX) + gridOffsetX, ToGridY(newY) + gridOffsetY, false);
        return;
      }

      await this.gridManager.setWalkable(map, ToGridX(oldX) + gridOffsetX, ToGridY(oldY) + gridOffsetY, true);

      await this.gridManager.setWalkable(map, ToGridX(newX) + gridOffsetX, ToGridY(newY) + gridOffsetY, false);

      // warn nearby characters that the NPC moved;
      const nearbyCharacters = await this.npcView.getCharactersInView(npc);

      for (const character of nearbyCharacters) {
        const isCharInNonPVPZone = this.mapNonPVPZone.getNonPVPZoneAtXY(character.scene, character.x, character.y);

        /*
        This is to prevent the NPC from attacking the player if they are in a non-PVP zone. 
        And when the player leaves the zone, the NPC will attack them again.
        */

        if (isCharInNonPVPZone && npc.alignment === NPCAlignment.Hostile) {
          await this.npcTarget.clearTarget(npc);
        }

        const isOnCharView = this.characterView.isOnCharacterView(character, npc._id, "npcs");

        if (!isOnCharView) {
          await this.npcWarn.warnCharacterAboutSingleNPCCreation(npc, character);
        } else {
          this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
            character.channelId!,
            NPCSocketEvents.NPCPositionUpdate,
            {
              id: npc.id,
              x: npc.x,
              y: npc.y,
              direction: chosenMovementDirection,
              alignment: npc.alignment as NPCAlignment,
            }
          );
        }
      }

      // use updateOne
      await NPC.updateOne({ _id: npc._id }, { x: newX, y: newY, direction: chosenMovementDirection });
    } catch (error) {
      console.error(error);
    }
  }

  public async getShortestPathNextPosition(
    npc: INPC,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): Promise<IShortestPathPositionResult | undefined> {
    try {
      const npcPath = await this.gridManager.findShortestPath(npc.scene, startGridX, startGridY, endGridX, endGridY);

      if (!npcPath || npcPath.length <= 1) {
        return;
        // throw new Error("Failed to calculate shortest path! No output!");
      }

      // get first next available position
      const [newGridX, newGridY] = npcPath[1];

      const nextMovementDirection = this.movementHelper.getGridMovementDirection(
        ToGridX(npc.x),
        ToGridY(npc.y),
        newGridX,
        newGridY
      );

      if (!nextMovementDirection) {
        return;
        // throw new Error(`Failed to calculate nextMovement for NPC ${npc.key}`);
      }

      return {
        newGridX,
        newGridY,
        nextMovementDirection,
      };
    } catch (error) {
      console.error(`❌ Error while trying to move NPC key: ${npc.key} at ${npc.x}, ${npc.y} - map ${npc.scene}`);
      console.error(error);
    }
  }
}
