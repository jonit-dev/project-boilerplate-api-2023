import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NewRelic } from "@providers/analytics/NewRelic";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { NewRelicTransactionCategory } from "@providers/types/NewRelicTypes";
import { BattleSocketEvents, EntityType, IBattleCancelTargeting } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleNetworkStopTargeting } from "./network/BattleNetworkStopTargetting";

@provide(BattleTargeting)
export class BattleTargeting {
  constructor(
    private battleNetworkStopTargeting: BattleNetworkStopTargeting,
    private socketMessaging: SocketMessaging,
    private newRelic: NewRelic
  ) {}

  public async cancelTargeting(
    attacker: ICharacter,
    reason: string,
    targetId: string,
    targetType: EntityType
  ): Promise<void> {
    await this.newRelic.trackTransaction(
      NewRelicTransactionCategory.Operation,
      "BattleTargeting.cancelTargeting",
      async () => {
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
    );
  }
}
