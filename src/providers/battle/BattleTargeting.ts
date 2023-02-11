import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, EntityType, IBattleCancelTargeting } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleNetworkStopTargeting } from "./network/BattleNetworkStopTargetting";

@provide(BattleTargeting)
export class BattleTargeting {
  constructor(
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private socketMessaging: SocketMessaging
  ) {}

  public async cancelTargeting(
    attacker: ICharacter,
    reason: string,
    targetId: string,
    targetType: EntityType
  ): Promise<void> {
    // if attacker has a target, cancel it and send message.
    if (attacker.target?.id?.toString() === targetId) {
      await this.battleNetworkStopTargeting.stopTargeting(attacker as unknown as ICharacter);

      this.socketMessaging.sendEventToUser<IBattleCancelTargeting>(
        attacker.channelId!,
        BattleSocketEvents.CancelTargeting,
        {
          targetId,
          type: targetType,
          reason,
        }
      );
    } else {
      // otherwise, just send error message

      this.socketMessaging.sendErrorMessageToCharacter(attacker, reason);
    }
  }
}
