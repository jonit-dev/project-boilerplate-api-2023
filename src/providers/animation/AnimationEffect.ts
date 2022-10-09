import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { AnimationSocketEvents, IAnimationEffect } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(AnimationEffect)
export class AnimationEffect {
  constructor(private socketMessaging: SocketMessaging) {}

  public async sendAnimationEvent(character: ICharacter, effectKey: string): Promise<void> {
    const payload: IAnimationEffect = {
      targetId: character.id,
      effectKey,
    };

    this.socketMessaging.sendEventToUser(character.channelId!, AnimationSocketEvents.ShowAnimation, payload);
    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      character,
      AnimationSocketEvents.ShowAnimation,
      payload
    );
  }
}
