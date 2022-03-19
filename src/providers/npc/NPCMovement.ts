import { Character } from "@entities/ModuleSystem/CharacterModel";
import { MapSolid } from "@entities/ModuleSystem/MapSolid";
import { INPC, NPC } from "@entities/ModuleSystem/NPCModel";
import { TilemapParser } from "@providers/map/TilemapParser";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { PlayerView } from "@providers/player/PlayerView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketTransmissionZone } from "@providers/sockets/SocketTransmissionZone";
import {
  AnimationDirection,
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
import _ from "lodash";
import { NPCLoader } from "./npcs/NPCLoader";
import { NPCView } from "./NPCView";

type NPCMovementDirection = "up" | "down" | "left" | "right";

@provide(NPCMovement)
export class NPCMovement {
  constructor(
    private movementHelper: MovementHelper,
    private tilemapParser: TilemapParser,
    private playerView: PlayerView,
    private socketMessaging: SocketMessaging,
    private npcView: NPCView,
    private socketTransmissionZone: SocketTransmissionZone
  ) {}

  public isNPCAtPathPosition(npc: INPC, gridX: number, gridY: number): boolean {
    if (ToGridX(npc.x) === gridX && ToGridY(npc.y) === gridY) {
      return true;
    }

    return false;
  }

  public async startFixedPathMovement(npc: INPC, endGridX: number, endGridY: number): Promise<void> {
    if (endGridX && endGridY) {
      const npcPath = this.movementHelper.findShortestPath(
        ScenesMetaData[npc.scene].map,
        ToGridX(npc.x),
        ToGridY(npc.y),
        endGridX,
        endGridY
      );

      if (!npcPath || npcPath.length <= 1) {
        console.log("Failed to calculated fixed path. NPC is stopped");
        return;
      }

      const [newGridX, newGridY] = npcPath[1];

      const nextMovementDirection = this.getGridMovementDirection(ToGridX(npc.x), ToGridY(npc.y), newGridX, newGridY);

      if (nextMovementDirection) {
        const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, nextMovementDirection);

        await this.moveNPC(npc, npc.x, npc.y, newX, newY, nextMovementDirection);
      } else {
        console.log("Failed to calculate fixed path. nextMovementDirection is undefined");
      }
    } else {
      console.log(
        "Failed to calculate fixed path. You must have a endGridX and endGridY position set in your NPC model"
      );
    }
  }

  public getGridMovementDirection(
    startGridX: number,
    startGridY: number,
    endGridX: number,
    endGridY: number
  ): AnimationDirection | undefined {
    const Xdiff = endGridX - startGridX;
    const Ydiff = endGridY - startGridY;

    if (Xdiff < 0 && Ydiff === 0) {
      return "left";
    }

    if (Xdiff > 0 && Ydiff === 0) {
      return "right";
    }

    if (Xdiff === 0 && Ydiff < 0) {
      return "up";
    }

    if (Xdiff === 0 && Ydiff > 0) {
      return "down";
    }
  }

  public async startRandomMovement(npc: INPC): Promise<void> {
    const npcMetaData = NPCLoader.NPCMetaData.get(npc.key);

    if (!npcMetaData) {
      console.log(`NPCMetaData for ${npc.name} not found!`);
      return;
    }

    let chosenMovementDirection = this.pickRandomDirectionToMove();

    const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);

    // npcMetaData stores the initial X and Y! That's why we don't use the npc.x and npc.y as initial args
    const isMovementUnderRange = npc.maxRangeInGridCells
      ? this.movementHelper.isMovementUnderRange(npcMetaData.x, npcMetaData.y, newX, newY, npc.maxRangeInGridCells)
      : true;

    if (!isMovementUnderRange) {
      console.log("Movement is out of range. Going back!");
      chosenMovementDirection = this.movementHelper.getOppositeDirection(chosenMovementDirection);
      const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);
      await this.moveNPC(npc, npc.x, npc.y, newX, newY, chosenMovementDirection);
    } else {
      await this.moveNPC(npc, npc.x, npc.y, newX, newY, chosenMovementDirection);
    }
  }

  private pickRandomDirectionToMove(): NPCMovementDirection {
    const availableDirections = ["down", "up", "right", "left"] as unknown as NPCMovementDirection;
    return _.shuffle(availableDirections)[0] as NPCMovementDirection;
  }

  private async hasSolid(npc: INPC, newX: number, newY: number): Promise<boolean> {
    const mapSolid = await MapSolid.findOne({
      map: ScenesMetaData[npc.scene].map,
      gridX: ToGridX(newX),
      gridY: ToGridY(newY),
      layer: npc.layer,
    });

    const isSolid = mapSolid?.isSolidThisLayerAndBelow;

    if (isSolid) {
      console.log(`${npc.name} tried to move, but was blocked by a solid tile!`);
      return true;
    }

    // check for other Characters
    const hasPlayer = await Character.exists({ x: newX, y: newY, scene: npc.scene, isOnline: true });

    if (hasPlayer) {
      console.log(`${npc.name} tried to move, but was blocked by a player!`);
      return true;
    }

    // and also for other NPCs!
    const hasNPC = await NPC.exists({ x: newX, y: newY, scene: npc.scene });

    if (hasNPC) {
      console.log(`${npc.name} tried to move, but was blocked by another NPC!`);

      return true;
    }

    return false;
  }

  private async moveNPC(
    npc: INPC,
    oldX: number,
    oldY: number,
    newX: number,
    newY: number,
    chosenMovementDirection: NPCMovementDirection
  ): Promise<void> {
    const map = ScenesMetaData[npc.scene].map;

    // update grid solids
    TilemapParser.grids.get(map)!.setWalkableAt(ToGridX(oldX), ToGridY(oldY), true);
    TilemapParser.grids.get(map)!.setWalkableAt(ToGridX(newX), ToGridY(newY), true);

    const newGridX = ToGridX(newX);
    const newGridY = ToGridY(newY);

    // check if max range is reached

    const hasSolid = await this.hasSolid(npc, newX, newY);
    if (hasSolid) {
      console.log(`${npc.name} tried to move to ${newGridX}, ${newGridY}, but it's solid`);

      return;
    }

    // warn nearby players that the NPC moved;

    // const nearbyPlayers = await this.playerView.getCharactersWithXYPositionInView(newX, newY, npc.scene);

    const nearbyPlayers = await this.npcView.getElementsInNPCView(Character, npc);

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
        }
      );
    }

    console.log(`${npc.name} moved to ${ToGridX(newX)}, ${ToGridY(newY)}`);
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
}
