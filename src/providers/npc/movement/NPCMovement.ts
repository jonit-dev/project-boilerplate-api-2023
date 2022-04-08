import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { TilemapParser } from "@providers/map/TilemapParser";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { INPCPositionUpdatePayload, NPCSocketEvents, ScenesMetaData, ToGridX, ToGridY } from "@rpg-engine/shared";
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
    private movementHelper: MovementHelper
  ) {}

  public isNPCAtPathPosition(npc: INPC, gridX: number, gridY: number): boolean {
    if (ToGridX(npc.x) === gridX && ToGridY(npc.y) === gridY) {
      return true;
    }

    return false;
  }

  private async hasSolid(npc: INPC, newX: number, newY: number): Promise<boolean | undefined> {
    try {
      const isSolid = await this.movementHelper.isSolid(
        ScenesMetaData[npc.scene].map,
        ToGridX(newX),
        ToGridY(newY),
        npc.layer
      );

      if (isSolid) {
        console.log(`${npc.key} tried to move, but was blocked by a solid tile!`);
        return true;
      }

      // check for other Characters
      const hasCharacter = await Character.exists({ x: newX, y: newY, scene: npc.scene, isOnline: true });

      if (hasCharacter) {
        console.log(`${npc.key} tried to move, but was blocked by a character!`);
        return true;
      }

      // and also for other NPCs!
      const hasNPC = await NPC.exists({ x: newX, y: newY, scene: npc.scene });

      if (hasNPC) {
        console.log(`${npc.key} tried to move, but was blocked by another NPC!`);

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
    }
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
      const map = ScenesMetaData[npc.scene].map;

      const newGridX = ToGridX(newX);
      const newGridY = ToGridY(newY);

      // check if max range is reached

      const hasSolid = await this.hasSolid(npc, newX, newY);
      if (hasSolid) {
        console.log(`${npc.key} tried to move to ${newGridX}, ${newGridY}, but it's solid`);

        return;
      }

      // update grid solids
      TilemapParser.grids.get(map)!.setWalkableAt(ToGridX(oldX), ToGridY(oldY), true);
      TilemapParser.grids.get(map)!.setWalkableAt(ToGridX(newX), ToGridY(newY), false);

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
      const npcPath = this.movementHelper.findShortestPath(
        ScenesMetaData[npc.scene].map,
        startGridX,
        startGridY,
        endGridX,
        endGridY
      );

      if (!npcPath || npcPath.length <= 1) {
        throw new Error("Failed to calculate shortest path! No output!");
      }

      const [newGridX, newGridY] = npcPath[1];

      const nextMovementDirection = this.movementHelper.getGridMovementDirection(
        ToGridX(npc.x),
        ToGridY(npc.y),
        newGridX,
        newGridY
      );

      if (!nextMovementDirection) {
        throw new Error(`Failed to calculate nextMovement for NPC ${npc.key}`);
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
