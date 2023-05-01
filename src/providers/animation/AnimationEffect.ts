import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  AnimationEffectKeys,
  AnimationSocketEvents,
  IAnimationEffect,
  IProjectileAnimationEffect,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(AnimationEffect)
export class AnimationEffect {
  constructor(private socketMessaging: SocketMessaging) {}

  public async sendAnimationEventToCharacter(
    character: ICharacter,
    effectKey: AnimationEffectKeys,
    targetId?: string
  ): Promise<void> {
    const payload: IAnimationEffect = {
      targetId: targetId ?? character._id,
      effectKey,
    };

    await this.sendAnimationEffectEvent(character, payload);
  }

  public async sendAnimationEventToNPC(npc: INPC, effectKey: string): Promise<void> {
    const payload: IAnimationEffect = {
      targetId: npc._id,
      effectKey,
    };

    await this.socketMessaging.sendEventToCharactersAroundNPC(npc, AnimationSocketEvents.ShowAnimation, payload);
  }

  public async sendProjectileAnimationEventToCharacter(
    character: ICharacter,
    sourceId: string,
    targetId: string,
    projectileEffectKey: string,
    effectKey?: string
  ): Promise<void> {
    const payload: IProjectileAnimationEffect = {
      sourceId,
      targetId,
      projectileEffectKey,
      effectKey,
    };

    await this.sendProjectileAnimationEffectEvent(character, payload);
  }

  public async sendProjectileAnimationEventToNPC(
    npc: INPC,
    sourceId: string,
    targetId: string,
    projectileEffectKey: string,
    effectKey?: string
  ): Promise<void> {
    const payload: IProjectileAnimationEffect = {
      sourceId,
      targetId,
      projectileEffectKey,
      effectKey,
    };

    await this.socketMessaging.sendEventToCharactersAroundNPC(
      npc,
      AnimationSocketEvents.ShowProjectileAnimation,
      payload
    );
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

  private async sendProjectileAnimationEffectEvent(
    character: ICharacter,
    payload: IProjectileAnimationEffect
  ): Promise<void> {
    this.socketMessaging.sendEventToUser(character.channelId!, AnimationSocketEvents.ShowProjectileAnimation, payload);
    await this.socketMessaging.sendEventToCharactersAroundCharacter(
      character,
      AnimationSocketEvents.ShowProjectileAnimation,
      payload
    );
  }
}
