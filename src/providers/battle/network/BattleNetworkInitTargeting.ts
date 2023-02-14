import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { MapNonPVPZone } from "@providers/map/MapNonPVPZone";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  BattleSocketEvents,
  GRID_WIDTH,
  IBattleCancelTargeting,
  IBattleInitTargeting,
  NPCAlignment,
  SOCKET_TRANSMISSION_ZONE_WIDTH,
} from "@rpg-engine/shared";
import { EntityType } from "@rpg-engine/shared/dist/types/entity.types";
import { provide } from "inversify-binding-decorators";
import { BattleCharacterAttack } from "../BattleCharacterAttack/BattleCharacterAttack";
import { BattleNetworkStopTargeting } from "./BattleNetworkStopTargetting";

interface ITargetValidation {
  isValid: boolean;
  reason?: string;
}

@provide(BattleNetworkInitTargeting)
export class BattleNetworkInitTargeting {
  constructor(
    private socketAuth: SocketAuth,
    private socketMessaging: SocketMessaging,
    private movementHelper: MovementHelper,
    private battleCharacterManager: BattleCharacterAttack,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private mapNonPVPZone: MapNonPVPZone
  ) {}

  public onBattleInitTargeting(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(
      channel,
      BattleSocketEvents.InitTargeting,
      async (data: IBattleInitTargeting, character: ICharacter) => {
        try {
          let target: INPC | ICharacter | null = null;

          if (data.type === EntityType.NPC) {
            target = await NPC.findOne({
              _id: data.targetId,
            });
          }

          if (data.type === EntityType.Character) {
            target = await Character.findOne({
              _id: data.targetId,
            });
          }

          if (!target) {
            this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
              character.channelId!,
              BattleSocketEvents.CancelTargeting,
              {
                targetId: data.targetId,
                type: data.type,
                reason: "Invalid target.",
              }
            );
            throw new Error(`Failed to set target on NPC ${data.targetId}`);
          }

          const isValidTarget = this.isValidTarget(target, character);

          if (!isValidTarget.isValid) {
            console.log(
              `${character.name} is trying to set a target to ${target.name} but it's not valid. Reason: ${isValidTarget.reason}`
            );
            this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
              character.channelId!,
              BattleSocketEvents.CancelTargeting,
              {
                targetId: data.targetId,
                type: data.type,
                reason: isValidTarget.reason,
              }
            );
          } else {
            await this.characterSetTargeting(character, target, data.type);
          }
          // validate if character actually can set this target
        } catch (error) {
          console.error(error);
        }
      }
    );
  }

  private async characterSetTargeting(
    character: ICharacter,
    target: ICharacter | INPC,
    targetType: EntityType
  ): Promise<void> {
    await this.battleNetworkStopTargeting.stopTargeting(character);

    await Character.updateOne(
      { _id: character._id },
      {
        $set: {
          target: {
            id: target._id,
            // @ts-ignore
            type: targetType,
          },
        },
      }
    );

    await this.battleCharacterManager.onHandleCharacterBattleLoop(character, target);
  }

  private isValidTarget(target: INPC | ICharacter | null, character: ICharacter): ITargetValidation {
    // check if target is within character range.
    if (target?.id === character.id) {
      return {
        isValid: false,
        reason: "You cannot attack yourself.",
      };
    }

    if (target!.health === 0) {
      return {
        isValid: false,
        reason: "You cannot attack a target that's already dead.",
      };
    }

    if (character.health === 0) {
      return {
        isValid: false,
        reason: "You cannot attack when you're dead.",
      };
    }

    if (target!.scene !== character.scene) {
      return {
        isValid: false,
        reason: "Your target is not on the same scene.",
      };
    }

    const npc = target as INPC;

    const isCharInNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(npc.scene, npc.x, npc.y);

    if (isCharInNonPVPZone && npc.type === EntityType.NPC) {
      return {
        isValid: false,
        reason: "You cannot attack a NPC inside a Non-PVP Zone!",
      };
    }

    // Apply specific validations by target type
    const specificTargetValidation = this.checkBySpecificType(target);
    if (!specificTargetValidation?.isValid) {
      return specificTargetValidation;
    }

    // Cannot attack inside a NoN PvP Zone a target outside a NoN PvP Zone
    const specificCharacterValidation = this.checkBySpecificType(character);
    if (!specificCharacterValidation?.isValid) {
      return specificCharacterValidation;
    }

    const isCharacterOnline = character.isOnline;
    if (!isCharacterOnline) {
      return {
        isValid: false,
        reason: "Offline targets are not allowed to set target!",
      };
    }

    /*
    Check character attack type. If melee, target should be within a 1 grid cell range. 
    If ranged, check max range.
    */

    const isUnderRange = this.movementHelper.isUnderRange(
      character.x,
      character.y,
      target!.x,
      target!.y,
      SOCKET_TRANSMISSION_ZONE_WIDTH / GRID_WIDTH
    );

    if (!isUnderRange) {
      return {
        isValid: false,
        reason: "Target is out of range.",
      };
    }

    if (target?.type === "NPC") {
      const npc = target as INPC;
      if (npc.alignment === NPCAlignment.Friendly) {
        return {
          isValid: false,
          reason: "Sorry, you cannot attack a friendly NPC.",
        };
      }
    }

    return {
      isValid: true,
    };
  }

  private checkBySpecificType(target: INPC | ICharacter | null): ITargetValidation {
    if (target?.type === EntityType.NPC) return this.isValidNPCTarget(target as unknown as INPC);
    if (target?.type === EntityType.Character) return this.isValidCharacterTarget(target as unknown as ICharacter);

    return {
      isValid: true,
    };
  }

  private isValidNPCTarget(target: INPC): ITargetValidation {
    const isNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(target.scene, target.x, target.y);

    if (isNonPVPZone && target.alignment === NPCAlignment.Friendly) {
      return {
        isValid: false,
        reason: "You cannot attack this entity.",
      };
    }

    return {
      isValid: true,
    };
  }

  private isValidCharacterTarget(target: ICharacter): ITargetValidation {
    const isNonPVPZone = this.mapNonPVPZone.isNonPVPZoneAtXY(target.scene, target.x, target.y);

    if (isNonPVPZone) {
      return {
        isValid: false,
        reason: "You cannot attack a target inside a Non-PVP Zone!",
      };
    }

    return {
      isValid: true,
    };
  }
}
