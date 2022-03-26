import { Character } from "@entities/ModuleSystem/CharacterModel";
import { INPC } from "@entities/ModuleSystem/NPCModel";
import { MathHelper } from "@providers/math/MathHelper";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCView } from "../NPCView";
import { NPCDirection } from "./NPCMovement";

interface IPlayerDistance {
  id: string;
  distance: number;
  x: number;
  y: number;
}

@provide(NPCTarget)
export class NPCTarget {
  constructor(private npcView: NPCView, private mathHelper: MathHelper, private movementHelper: MovementHelper) {}

  public getTargetDirection(npc: INPC, targetX: number, targetY: number): NPCDirection {
    if (npc.y < targetY) {
      return "down";
    }

    if (npc.y > targetY) {
      return "up";
    }

    if (npc.x < targetX) {
      return "right";
    }

    if (npc.x > targetX) {
      return "left";
    }

    return "down";
  }

  public async tryToSetTarget(npc: INPC): Promise<void> {
    console.log(`${npc.key} trying to set target...`);

    const nearbyPlayers = await this.npcView.getCharactersInView(npc);

    const playersDistance: IPlayerDistance[] = [];

    for (const nearbyPlayer of nearbyPlayers) {
      const distance = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, nearbyPlayer.x, nearbyPlayer.y);

      playersDistance.push({
        id: nearbyPlayer.id,
        distance: distance,
        x: nearbyPlayer.x,
        y: nearbyPlayer.y,
      });
    }

    // get the player with minimum distance
    const minDistancePlayer = _.minBy(playersDistance, "distance");

    if (minDistancePlayer) {
      if (!npc.maxRangeInGridCells) {
        console.log(`NPC ${npc.key} has MoveTowards MovementType, but no maxRangeInGridCells is specified!`);
        return;
      }

      // check if player is under range
      const isMovementUnderRange = this.movementHelper.isUnderRange(
        npc.x,
        npc.y,
        minDistancePlayer.x,
        minDistancePlayer.y,
        npc.maxRangeInGridCells
      );

      if (!isMovementUnderRange) {
        return;
      }

      const character = await Character.findById(minDistancePlayer.id);

      if (!character) {
        console.log(`Error in ${npc.key}: Failed to find character to set as target!`);
        return;
      }

      npc.targetCharacter = character._id;
      await npc.save();
    }
  }

  public async checkTargetOutOfRangeOrLoggedOut(npc: INPC): Promise<void> {
    console.log("Checking if target is out of range...");
    if (!npc.targetCharacter) {
      // no target set, nothing to remove here!
      return;
    }

    if (!npc.maxRangeInGridCells) {
      console.log(`NPC ${npc.key} has MoveTowards MovementType, but no maxRangeInGridCells is specified!`);
      return;
    }

    const targetCharacter = await Character.findById(npc.targetCharacter);

    if (!targetCharacter) {
      console.log(`Error in ${npc.key}: Failed to find targetCharacter!`);
      return;
    }

    const isMovementUnderRange = this.movementHelper.isUnderRange(
      npc.x,
      npc.y,
      targetCharacter.x,
      targetCharacter.y,
      npc.maxRangeInGridCells
    );

    // if target is out of range or not online, lets remove it
    if ((targetCharacter && !isMovementUnderRange) || !targetCharacter.isOnline) {
      // remove npc.targetCharacter
      npc.targetCharacter = undefined;
      await npc.save();
    }
  }
}