import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCAlignment, NPCTargetType, NPC_MAX_TALKING_DISTANCE_IN_GRID } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPCBattleCycle } from "../NPCBattleCycle";
import { NPCView } from "../NPCView";
import { NPCDirection } from "./NPCMovement";

@provide(NPCTarget)
export class NPCTarget {
  constructor(private npcView: NPCView, private movementHelper: MovementHelper, private mapNonPVPZone: MapNonPVPZone) {}

  public async clearTarget(npc: INPC): Promise<void> {
    npc.targetCharacter = undefined;
    npc.targetType = NPCTargetType.Default;
    npc.currentMovementType = npc.originalMovementType;

    await npc.save();

    const npcBattleCycle = NPCBattleCycle.npcBattleCycles.get(npc.id);
    if (npcBattleCycle) {
      await npcBattleCycle.clear();
    }
  }

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

        const isCharInNonPVPZone = this.mapNonPVPZone.getNonPVPZoneAtXY(character.scene, character.x, character.y);
        // This is needed to prevent NPCs(Hostile) from attacking players in non-PVP zones
        if (isCharInNonPVPZone && npc.alignment === NPCAlignment.Hostile) {
          await this.clearTarget(npc);

          return;
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
        await this.clearTarget(npc);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async setTarget(npc: INPC, character: ICharacter): Promise<void> {
    try {
      if (!npc.isAlive) {
        return;
      }

      const char = await Character.findById(character.id);
      if (!char) {
        throw new Error(`Error in ${npc.key}: Failed to find character to set as target!`);
      }

      npc.targetCharacter = char._id;
      await npc.save();
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
