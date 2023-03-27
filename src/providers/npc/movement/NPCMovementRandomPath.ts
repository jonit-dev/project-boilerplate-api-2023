/* eslint-disable no-unused-vars */
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { provide } from "inversify-binding-decorators";

import { appEnv } from "@providers/config/env";
import random from "lodash/random";
import shuffle from "lodash/shuffle";
import { NPCDirection, NPCMovement } from "./NPCMovement";

@provide(NPCMovementRandomPath)
export class NPCMovementRandomPath {
  constructor(private movementHelper: MovementHelper, private NPCMovement: NPCMovement) {}

  public async startRandomMovement(npc: INPC): Promise<boolean | undefined> {
    try {
      const stopChance = appEnv.general.IS_UNIT_TEST ? 100 : random(0, 100);

      //! Ideally, this would be not called here, but on the NPC Cycle level (pause the cycle every X seconds). For now, lets leave this ugly hack.
      if (stopChance <= 70) {
        return;
      }

      let chosenMovementDirection = this.pickRandomDirectionToMove();

      const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);

      // npcMetaData stores the initial X and Y! That's why we don't use the npc.x and npc.y as initial args
      const isMovementUnderRange = npc.maxRangeInGridCells
        ? this.movementHelper.isUnderRange(npc.initialX, npc.initialY, newX, newY, npc.maxRangeInGridCells)
        : true;

      if (!isMovementUnderRange) {
        chosenMovementDirection = this.movementHelper.getOppositeDirection(chosenMovementDirection);
        const { x: newX, y: newY } = this.movementHelper.calculateNewPositionXY(npc.x, npc.y, chosenMovementDirection);
        await this.NPCMovement.moveNPC(npc, npc.x, npc.y, newX, newY, chosenMovementDirection);
        return false; // movement out of range
      } else {
        await this.NPCMovement.moveNPC(npc, npc.x, npc.y, newX, newY, chosenMovementDirection);
        return true; // random movement complete
      }
    } catch (error) {
      console.error(error);
    }
  }

  private pickRandomDirectionToMove(): NPCDirection {
    const availableDirections = ["down", "up", "right", "left"] as unknown as NPCDirection;
    return shuffle(availableDirections)[0] as NPCDirection;
  }
}
