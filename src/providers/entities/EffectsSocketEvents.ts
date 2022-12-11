import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { AnimationEffect } from "@providers/animation/AnimationEffect";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IBattleEventFromServer } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { IEntityEffect } from "./data/blueprints/entityEffect";

@provide(EffectsSocketEvents)
export class EffectsSocketEvents {
  constructor(private socketMessaging: SocketMessaging, private animationEffect: AnimationEffect) {}

  public async EntityEffect(
    targetChannelID: string,
    entryEffectFromServer: IBattleEventFromServer,
    target: ICharacter | INPC,
    entityEffect: IEntityEffect
  ): Promise<void> {
    if (target.health > entityEffect.value) {
      entryEffectFromServer.postDamageTargetHP = 100 - (target.health - entityEffect.value);
      // send effect value for display
      this.socketMessaging.sendEventToUser(targetChannelID, "EntryEffect", entryEffectFromServer);

      // // reduce the health of the target
      target.health = target.health - entityEffect.value;
      await target.save();
    }
  }
}
