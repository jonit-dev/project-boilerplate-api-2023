import { Character } from "@entities/ModuleSystem/CharacterModel";
import { INPC, NPC } from "@entities/ModuleSystem/NPCModel";
import { TilemapParser } from "@providers/map/TilemapParser";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import {
  GRID_HEIGHT,
  GRID_WIDTH,
  INPCPositionUpdatePayload,
  NPCSocketEvents,
  ScenesMetaData,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
  ToGridX,
  ToGridY,
} from "@rpg-engine/shared";
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
    private socketTransmissionZone: SocketTransmissionZone,
    private movementHelper: MovementHelper
  ) {}

  public isNPCAtPathPosition(npc: INPC, gridX: number, gridY: number): boolean {
    if (ToGridX(npc.x) === gridX && ToGridY(npc.y) === gridY) {
      return true;
    }

    return false;
  }

  private async hasSolid(npc: INPC, newX: number, newY: number): Promise<boolean> {
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
    const hasPlayer = await Character.exists({ x: newX, y: newY, scene: npc.scene, isOnline: true });

    if (hasPlayer) {
      console.log(`${npc.key} tried to move, but was blocked by a player!`);
      return true;
    }

    // and also for other NPCs!
    const hasNPC = await NPC.exists({ x: newX, y: newY, scene: npc.scene });

    if (hasNPC) {
      console.log(`${npc.key} tried to move, but was blocked by another NPC!`);

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

    // warn nearby players that the NPC moved;

    // const nearbyPlayers = await this.playerView.getCharactersWithXYPositionInView(newX, newY, npc.scene);

    const nearbyPlayers = await this.npcView.getCharactersInView(npc);

    for (const player of nearbyPlayers) {
      this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
        player.channelId!,
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
        }
      );
    }

    console.log(`${npc.key} moved to ${ToGridX(newX)}, ${ToGridY(newY)}`);
    npc.x = newX;
    npc.y = newY;
    npc.direction = chosenMovementDirection;

    const { x, y, width, height } = this.socketTransmissionZone.calculateSocketTransmissionZone(
      npc.x,
      npc.y,
      GRID_WIDTH,
      GRID_HEIGHT,
      SOCKET_TRANSMISSION_ZONE_WIDTH,
      SOCKET_TRANSMISSION_ZONE_WIDTH
    );

    npc.socketTransmissionZone = {
      x,
      y,
      width,
      height,
    };
    await npc.save();
  }

  public getShortestPathNextPosition(
    npc: INPC,
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): IShortestPathPositionResult | undefined {
    const npcPath = this.movementHelper.findShortestPath(
      ScenesMetaData[npc.scene].map,
      startGridX,
      startGridY,
      endGridX,
      endGridY
    );

    if (!npcPath || npcPath.length <= 1) {
      console.log("Failed to calculated shortest path! No output!");
      return;
    }

    const [newGridX, newGridY] = npcPath[1];

    const nextMovementDirection = this.movementHelper.getGridMovementDirection(
      ToGridX(npc.x),
      ToGridY(npc.y),
      newGridX,
      newGridY
    );

    if (!nextMovementDirection) {
      console.log(`Failed to calculated nextMovementDirection for NPC ${npc.key}`);
      return;
    }

    return {
      newGridX,
      newGridY,
      nextMovementDirection,
    };
  }
}