import { ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { INPC, NPC } from "@entities/ModuleSystem/NPCModel";
import { TilemapParser } from "@providers/map/TilemapParser";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { PlayerView } from "@providers/player/PlayerView";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { INPCPositionUpdatePayload, NPCSocketEvents, ScenesMetaData, ToGridX, ToGridY } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCMetaData } from "./NPCMetaData";

type NPCMovementDirection = "up" | "down" | "left" | "right";

@provide(NPCManager)
export class NPCManager {
  constructor(
    private tilemapParser: TilemapParser,
    private playerView: PlayerView,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper
  ) {}

  public init(NPCs: INPC[]): void {
    setInterval(async () => {
      for (const npc of NPCs) {
        if (npc.maxRangeInGridCells) {
          const npcMetaData = NPCMetaData.find((npcMetaData) => npcMetaData.key === npc.key);

          if (!npcMetaData) {
            console.log(`NPCMetaData for ${npc.name} not found!`);
            continue;
          }

          let chosenMovementDirection = this.pickRandomDirectionToMove();

          const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(
            npc.x,
            npc.y,
            chosenMovementDirection
          );

          // npcMetaData stores the initial X and Y! That's why we don't use the npc.x and npc.y as initial args
          const isMovementUnderRange = this.movementHelper.isMovementUnderRange(
            npcMetaData.x,
            npcMetaData.y,
            newX,
            newY,
            npc.maxRangeInGridCells
          );

          if (!isMovementUnderRange) {
            console.log("Movement is out of range. Going back!");
            chosenMovementDirection = this.movementHelper.getOppositeDirection(chosenMovementDirection);
            const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(
              npc.x,
              npc.y,
              chosenMovementDirection
            );
            await this.moveNPC(npc, newX, newY, chosenMovementDirection);

            continue;
          } else {
            await this.moveNPC(npc, newX, newY, chosenMovementDirection);
          }
        }
      }
    }, 3000);
  }

  public async warnUserAboutNPCsInView(character: ICharacter): Promise<void> {
    const npcsInView = await this.getNPCsInView(character);

    for (const npc of npcsInView) {
      this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
        character.channelId!,
        NPCSocketEvents.NPCPositionUpdate,
        {
          id: npc._id,
          name: npc.name,
          x: npc.x,
          y: npc.y,
          direction: npc.direction,
          key: npc.key,
          layer: npc.layer,
        }
      );
    }
  }

  public async getNPCsInView(character: ICharacter): Promise<INPC[]> {
    const npcsInView = await this.playerView.getElementsInCharView(NPC, character);

    return npcsInView;
  }

  private pickRandomDirectionToMove(): NPCMovementDirection {
    const availableDirections = ["down", "up", "right", "left"] as unknown as NPCMovementDirection;
    return _.shuffle(availableDirections)[0] as NPCMovementDirection;
  }

  private async moveNPC(
    npc: INPC,
    newX: number,
    newY: number,
    chosenMovementDirection: NPCMovementDirection
  ): Promise<void> {
    const newGridX = ToGridX(newX);
    const newGridY = ToGridY(newY);

    // check if max range is reached

    const isNewXYSolid = this.tilemapParser.isSolid(ScenesMetaData[npc.scene].map, newGridX, newGridY, npc.layer);

    if (isNewXYSolid) {
      console.log(`${npc.name} tried to move to ${newGridX}, ${newGridY}, but it's solid`);
      return;
    }

    // warn nearby players that the NPC moved;

    const nearbyPlayers = await this.playerView.getCharactersWithXYPositionInView(newX, newY, npc.scene);

    for (const player of nearbyPlayers) {
      this.socketMessaging.sendEventToUser<INPCPositionUpdatePayload>(
        player.channelId!,
        NPCSocketEvents.NPCPositionUpdate,
        {
          id: npc._id,
          name: npc.name,
          x: npc.x,
          y: npc.y,
          direction: chosenMovementDirection,
          key: npc.key,
          layer: npc.layer,
        }
      );
    }

    console.log(`${npc.name} moved to ${ToGridX(newX)}, ${ToGridY(newY)}`);
    npc.x = newX;
    npc.y = newY;
    npc.direction = chosenMovementDirection;
    await npc.save();
  }
}
