import { Character, ICharacter } from "@entities/ModuleSystem/CharacterModel";
import { INPC } from "@entities/ModuleSystem/NPCModel";
import { MathHelper } from "@providers/math/MathHelper";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { NPCView } from "../NPCView";

interface IPlayerDistance {
  id: string;
  distance: number;
  x: number;
  y: number;
}

@provide(NPCMovementMoveTowards)
export class NPCMovementMoveTowards {
  constructor(private npcView: NPCView, private mathHelper: MathHelper, private movementHelper: MovementHelper) {}

  public async startMoveTowardsMovement(npc: INPC): Promise<void> {
    // first step is setting a target
    // for this, get all players nearby and set the target to the closest one
    await this.tryToSetTarget(npc);

    await this.checkTargetOutOfRange(npc);
  }

  private async tryToSetTarget(npc: INPC): Promise<void> {
    const targetCharacter = npc.targetCharacter as unknown as ICharacter;

    if (!targetCharacter) {
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

      console.log(minDistancePlayer);

      if (minDistancePlayer) {
        if (!npc.maxRangeInGridCells) {
          console.log(`NPC ${npc.key} has MoveTowards MovementType, but no maxRangeInGridCells is specified!`);
          return;
        }

        // check if player is under range
        const isMovementUnderRange = this.movementHelper.isMovementUnderRange(
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
  }

  private async checkTargetOutOfRange(npc: INPC): Promise<void> {
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

    const isMovementUnderRange = this.movementHelper.isMovementUnderRange(
      npc.x,
      npc.y,
      targetCharacter.x,
      targetCharacter.y,
      npc.maxRangeInGridCells
    );

    // if target is out of range, lets remove it
    if (targetCharacter && !isMovementUnderRange) {
      // remove npc.targetCharacter
      npc.targetCharacter = undefined;
      await npc.save();
    }
  }
}
