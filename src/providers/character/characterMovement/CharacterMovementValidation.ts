import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SpecialEffect } from "@providers/entityEffects/SpecialEffect";
import { Locker } from "@providers/locks/Locker";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUIShowMessage, MapLayers, ToGridX, ToGridY, UISocketEvents } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import { CharacterBan } from "../CharacterBan";
import { CharacterValidation } from "../CharacterValidation";

@provide(CharacterMovementValidation)
export class CharacterMovementValidation {
  constructor(
    private characterValidation: CharacterValidation,
    private movementHelper: MovementHelper,
    private socketMessaging: SocketMessaging,
    private characterBan: CharacterBan,
    private specialEffect: SpecialEffect,
    private locker: Locker
  ) {}

  public async isValid(character: ICharacter, newX: number, newY: number, isMoving: boolean): Promise<boolean> {
    if (!isMoving) {
      return true; // if character is not moving, we dont need to check anything else!
    }

    const hasBasicValidation = this.characterValidation.hasBasicValidation(character);

    if (!hasBasicValidation) {
      return false;
    }

    const isLocked = await this.locker.hasLock(`character-changing-scene-${character._id}`);

    if (isLocked) {
      console.log(`🚫 ${character.name} is trying to move while changing the scene`);
      return false;
    }

    if (await this.specialEffect.isStun(character)) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, you can't move because you're stunned",
        type: "error",
      });
      return false;
    }

    if (!this.movementHelper.isSnappedToGrid(newX, newY)) {
      console.log(`🚫 ${character.name} lost snapping to grid!`);
      return false;
    }

    const isUnderRange = this.movementHelper.isUnderRange(character.x, character.y, newX, newY, 5);

    if (!isUnderRange) {
      console.log(`🚫 ${character.name} is trying to move too far away!`);
      return false;
    }

    const isTooHeavy = this.isCharacterTooHeavy(character);

    if (isTooHeavy) {
      return false;
    }

    const isMovingTooFast = await this.isCharacterMovingTooFast(character);

    if (isMovingTooFast) {
      return false;
    }

    const isSolid = await this.movementHelper.isSolid(
      character.scene,
      ToGridX(newX),
      ToGridY(newY),
      MapLayers.Character
    );

    if (isSolid) {
      console.log(`🚫 ${character.name} is trying to move to a solid!`);

      return false;
    }

    return true;
  }

  private isCharacterTooHeavy(character: ICharacter): boolean {
    if (character.speed === 0) {
      this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
        message: "Sorry, you're too heavy to move. Please drop something from your inventory.",
        type: "error",
      });
      return true;
    }

    return false;
  }

  private isCharacterMovingTooFast(character: ICharacter): boolean {
    if (character.lastMovement) {
      const now = dayjs(new Date());
      const lastMovement = dayjs(character.lastMovement);
      const movementDiff = now.diff(lastMovement, "millisecond");

      if (movementDiff < character.movementIntervalMs / 4 || character.baseSpeed > 5) {
        console.log(`⚠️ ${character.name} is moving too fast!`);
        this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
          message: "Sorry, you're moving too fast.",
          type: "error",
        });
        return true;
      }
    }
    return false;
  }
}
