import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
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
import { Optional } from "ts-mongoose";
import { BattleCharacterManager } from "../BattleCharacterManager";
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
    private battleCharacterManager: BattleCharacterManager,
    private battleNetworkStopTargeting: BattleNetworkStopTargeting
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

            const isValidNPCTarget = this.isValidNPCTarget(target, character);

            if (!isValidNPCTarget.isValid) {
              console.log(
                `${character.name} is trying to set a target to ${target.key} but it's not valid. Reason: ${isValidNPCTarget.reason}`
              );
              this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
                character.channelId!,
                BattleSocketEvents.CancelTargeting,
                {
                  targetId: data.targetId,
                  type: data.type,
                  reason: isValidNPCTarget.reason,
                }
              );
            } else {
              await this.characterSetTargeting(character, target, data.type);
            }
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
    character.target.id = target._id;
    character.target.type = targetType as unknown as Optional<string>;
    await character.save();
    this.battleCharacterManager.onHandleCharacterBattleLoop(character, target);
  }

  private isValidNPCTarget(target: INPC, character: ICharacter): ITargetValidation {
    // check if target is within character range.

    if (target.health === 0) {
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

    if (target.scene !== character.scene) {
      return {
        isValid: false,
        reason: "Your target is not on the same scene.",
      };
    }

    if (target.alignment === NPCAlignment.Friendly) {
      return {
        isValid: false,
        reason: "You cannot attack this entity.",
      };
    }

    const isCharacterOnline = character.isOnline;

    if (!isCharacterOnline) {
      return {
        isValid: false,
        reason: "Offline targets are not allowed to set target!",
      };
    }

    // check character attack type. If melee, target should be within a 1 grid cell range. if ranged, check max range.

    const isUnderRange = this.movementHelper.isUnderRange(
      character.x,
      character.y,
      target.x,
      target.y,
      SOCKET_TRANSMISSION_ZONE_WIDTH / GRID_WIDTH
    );

    if (!isUnderRange) {
      return {
        isValid: false,
        reason: "Target is out of range.",
      };
    }

    return {
      isValid: true,
    };
  }

  // private isValidCharacterTarget(target: ICharacter, character): boolean {
  //   // TODO: implement it later, in PVP system
  // }
}
