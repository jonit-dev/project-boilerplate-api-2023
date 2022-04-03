import { INPC } from "@entities/ModuleSystem/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCLoader } from "../NPCLoader";
import { NPCDirection, NPCMovement } from "./NPCMovement";

@provide(NPCMovementRandomPath)
export class NPCMovementRandomPath {
  constructor(private movementHelper: MovementHelper, private NPCMovement: NPCMovement) {}

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
      ? this.movementHelper.isUnderRange(npcMetaData.x, npcMetaData.y, newX, newY, npc.maxRangeInGridCells)
      : true;

    if (!isMovementUnderRange) {
      console.log("Movement is out of range. Going back!");
      chosenMovementDirection = this.movementHelper.getOppositeDirection(chosenMovementDirection);
      const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);
      await this.NPCMovement.moveNPC(npc, npc.x, npc.y, newX, newY, chosenMovementDirection);
    } else {
      await this.NPCMovement.moveNPC(npc, npc.x, npc.y, newX, newY, chosenMovementDirection);
    }
  }

  private pickRandomDirectionToMove(): NPCDirection {
    const availableDirections = ["down", "up", "right", "left"] as unknown as NPCDirection;
    return _.shuffle(availableDirections)[0] as NPCDirection;
  }
}
