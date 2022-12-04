import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { provide } from "inversify-binding-decorators";
import { IEntityEffectSocket } from "./data/blueprints/entityEffectSocket";

@provide(EffectsSocketEvents)
export class EffectsSocketEvents {
  constructor(private socketMessaging: SocketMessaging) {}

  public EntityEffect(attackId: string, entityEffectKey: string, entityEffectSocket: IEntityEffectSocket): void {
    this.socketMessaging.sendEventToUser(attackId, entityEffectKey, entityEffectSocket);
  }
}
