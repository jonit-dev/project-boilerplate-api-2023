import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { NPC_CAN_ATTACK_IN_NON_PVP_ZONE } from "@providers/constants/NPCConstants";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { Locker } from "@providers/locks/Locker";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { NPCAlignment, NPCTargetType, NPC_MAX_TALKING_DISTANCE_IN_GRID } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { NPC_BATTLE_CYCLES } from "../NPCBattleCycle";
import { NPC_CYCLES } from "../NPCCycle";
import { NPCView } from "../NPCView";
import { NPCDirection } from "./NPCMovement";

@provide(NPCTarget)
export class NPCTarget {
  constructor(
    private npcView: NPCView,
    private movementHelper: MovementHelper,
    private mapNonPVPZone: MapNonPVPZone,
    private specialEffect: SpecialEffect,
    private locker: Locker
  ) {}

  public async clearTarget(npc: INPC): Promise<void> {
    await NPC.updateOne(
      { _id: npc.id },
      {
        $set: {
          targetType: NPCTargetType.Default,
          currentMovementType: npc.originalMovementType,
        },
        $unset: {
          targetCharacter: "",
        },
      }
    );

    await this.locker.unlock(`npc-${npc._id}-battle-cycle`);

    const npcBattleCycle = NPC_BATTLE_CYCLES.get(npc.id);
    const npcCycle = NPC_CYCLES.get(npc.id);
    if (npcBattleCycle) {
      await npcBattleCycle.clear();
    }
    if (npcCycle) {
      await npcCycle.clear();
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
    if (!npc.isAlive) {
      return;
    }

    if (!npc.maxRangeInGridCells) {
      throw new Error(
        `NPC ${npc.key} is trying to set target, but no maxRangeInGridCells is specified (required for range)!`
      );
    }

    const minDistanceCharacter = await this.npcView.getNearestCharacter(npc);

    if (!minDistanceCharacter) {
      return;
    }

    if (await this.specialEffect.isInvisible(minDistanceCharacter)) {
      return;
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

    const character = await Character.findById(minDistanceCharacter.id).lean();

    if (!character) {
      throw new Error(`Error in ${npc.key}: Failed to find character to set as target!`);
    }

    if (!NPC_CAN_ATTACK_IN_NON_PVP_ZONE) {
      const isCharInNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(character.scene, character.x, character.y);
      // This is needed to prevent NPCs(Hostile) from attacking players in non-PVP zones
      if (isCharInNonPVPZone && npc.alignment === NPCAlignment.Hostile) {
        await this.clearTarget(npc);

        return;
      }
    }

    // set target using updateOne
    await NPC.updateOne({ _id: npc._id }, { $set: { targetCharacter: character._id } });
  }

  public async tryToClearOutOfRangeTargets(npc: INPC): Promise<void> {
    if (!npc.targetCharacter) {
      // no target set, nothing to remove here!
      return;
    }

    if (!npc.maxRangeInGridCells) {
      throw new Error(`NPC ${npc.key} is trying to verify target, but no maxRangeInGridCells is specified!`);
    }

    const targetCharacter = await Character.findById(npc.targetCharacter).lean();

    if (!targetCharacter) {
      throw new Error(`Error in ${npc.key}: Failed to find targetCharacter!`);
    }

    const rangeThresholdDefinition = this.getRangeThreshold(npc);

    if (!rangeThresholdDefinition) {
      throw new Error(`NPC ${npc.key} is trying to set target, failed to calculate rangeThresholdDefinition!`);
    }

    const isCharacterUnderRange = this.movementHelper.isUnderRange(
      npc.x,
      npc.y,
      targetCharacter.x,
      targetCharacter.y,
      rangeThresholdDefinition
    );

    // if target is out of range or not online or invisible, lets remove it
    if ((targetCharacter && !isCharacterUnderRange) || !targetCharacter.isOnline) {
      // remove npc.targetCharacter
      await this.clearTarget(npc);
    }
  }

  public async setTarget(npc: INPC, character: ICharacter): Promise<void> {
    try {
      if (!npc.isAlive) {
        return;
      }

      const char = await Character.findById(character.id).lean();
      if (!char) {
        throw new Error(`Error in ${npc.key}: Failed to find character to set as target!`);
      }

      await NPC.updateOne({ _id: npc._id }, { $set: { targetCharacter: char._id } });
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
