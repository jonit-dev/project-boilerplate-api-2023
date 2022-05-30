import { Character } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MathHelper } from "@providers/math/MathHelper";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCTargetType, NPC_MAX_TALKING_DISTANCE_IN_GRID } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCView } from "../NPCView";
import { NPCDirection } from "./NPCMovement";

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
    try {
      if (!npc.isAlive) {
        return;
      }

      const minDistanceCharacter = await this.npcView.getNearestCharacter(npc);

      if (minDistanceCharacter) {
        if (!npc.maxRangeInGridCells) {
          throw new Error(
            `NPC ${npc.key} is trying to set target, but no maxRangeInGridCells is specified (required for range)!`
          );
        }

        const rangeThresholdDefinition = this.getRangeThreshold(npc);

        if (!rangeThresholdDefinition) {
          throw new Error(`NPC ${npc.key} is trying to set target, failed ot calculate rangeThresholdDefinition!`);
        }

        // check if character is under range
        const isMovementUnderRange = this.movementHelper.isUnderRange(
          npc.x,
          npc.y,
          minDistanceCharacter.x,
          minDistanceCharacter.y,
          rangeThresholdDefinition
        );

        if (!isMovementUnderRange) {
          return;
        }

        const character = await Character.findById(minDistanceCharacter.id);

        if (!character) {
          throw new Error(`Error in ${npc.key}: Failed to find character to set as target!`);
        }

        npc.targetCharacter = character._id;
        await npc.save();
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async tryToClearOutOfRangeTargets(npc: INPC): Promise<void> {
    try {
      if (!npc.targetCharacter) {
        // no target set, nothing to remove here!
        return;
      }

      if (!npc.maxRangeInGridCells) {
        throw new Error(`NPC ${npc.key} is trying to verify target, but no maxRangeInGridCells is specified!`);
      }

      const targetCharacter = await Character.findById(npc.targetCharacter);

      if (!targetCharacter) {
        throw new Error(`Error in ${npc.key}: Failed to find targetCharacter!`);
      }

      const rangeThresholdDefinition = this.getRangeThreshold(npc);

      if (!rangeThresholdDefinition) {
        throw new Error(`NPC ${npc.key} is trying to set target, failed ot calculate rangeThresholdDefinition!`);
      }

      const isCharacterUnderRange = this.movementHelper.isUnderRange(
        npc.x,
        npc.y,
        targetCharacter.x,
        targetCharacter.y,
        rangeThresholdDefinition
      );

      // if target is out of range or not online, lets remove it
      if ((targetCharacter && !isCharacterUnderRange) || !targetCharacter.isOnline) {
        // remove npc.targetCharacter
        npc.targetCharacter = undefined;
        npc.currentMovementType = npc.originalMovementType;
        npc.targetType = NPCTargetType.Default;
        await npc.save();
      }
    } catch (error) {
      console.error(error);
    }
  }

  private getRangeThreshold(npc: INPC): number | undefined {
    switch (npc.targetType) {
      case NPCTargetType.Default:
        return npc.maxRangeInGridCells;

      case NPCTargetType.Talking:
        return NPC_MAX_TALKING_DISTANCE_IN_GRID;
    }

    return npc.maxRangeInGridCells;
  }
}
