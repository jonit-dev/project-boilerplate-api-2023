import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { AnimationSocketEvents, IAnimationEffect } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(AnimationEffect)
export class AnimationEffect {
  constructor(private socketMessaging: SocketMessaging) {}

  public async sendAnimationEventToCharacter(
    character: ICharacter,
    effectKey: string,
    targetId?: string
  ): Promise<void> {
    const payload: IAnimationEffect = {
      targetId: targetId ?? character._id,
      effectKey,
    };

    await this.sendAnimationEffectEvent(character, payload);
  }

  public async sendAnimationEventToXYPosition(
    character: ICharacter,
    effectKey: string,
    targetX: number,
    targetY: number
  ): Promise<void> {
    const payload: IAnimationEffect = {
      effectKey,
      targetX,
      targetY,
    };

    await this.sendAnimationEffectEvent(character, payload);
  }

  private async sendAnimationEffectEvent(character: ICharacter, payload: IAnimationEffect): Promise<void> {
    this.socketMessaging.sendEventToUser(character.channelId!, AnimationSocketEvents.ShowAnimation, payload);
    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      character,
      AnimationSocketEvents.ShowAnimation,
      payload
    );
  }
}
