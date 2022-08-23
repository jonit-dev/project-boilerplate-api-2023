import { INPC } from "@entities/ModuleNPC/NPCModel";
import { GridManager } from "@providers/map/GridManager";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { INPCPositionUpdatePayload, NPCAlignment, NPCSocketEvents, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "../NPCView";

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
    private gridManager: GridManager
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

      if (hasSolid) {
        // console.log(`${npc.key} tried to move to ${newGridX}, ${newGridY}, but it's solid`);
        return;
      }

      this.gridManager.setWalkable(map, ToGridX(oldX), ToGridY(oldY), true);
      this.gridManager.setWalkable(map, ToGridX(newX), ToGridY(newY), false);

      // warn nearby characters that the NPC moved;

      const nearbyCharacters = await this.npcView.getCharactersInView(npc);

      for (const character of nearbyCharacters) {
        this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
          character.channelId!,
          NPCSocketEvents.NPCPositionUpdate,
          {
            id: npc.id,
            name: npc.name,
            x: npc.x,
            y: npc.y,
            direction: chosenMovementDirection,
            key: npc.key,
            layer: npc.layer,
            textureKey: npc.textureKey,
            scene: npc.scene,
            speed: npc.speed,
            alignment: npc.alignment as NPCAlignment,
            health: npc.health,
            maxHealth: npc.maxHealth,
            mana: npc.mana,
            maxMana: npc.maxMana,
            hasQuest: await npc.hasQuest,
          }
        );
      }

      npc.x = newX;
      npc.y = newY;
      npc.direction = chosenMovementDirection;

      await npc.save();
    } catch (error) {
      console.error(error);
    }
  }

  public getShortestPathNextPosition(
    npc: INPC,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): IShortestPathPositionResult | undefined {
    try {
      const npcPath = this.gridManager.findShortestPath(npc.scene, startGridX, startGridY, endGridX, endGridY);

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
      console.error(error);
    }
  }
}
