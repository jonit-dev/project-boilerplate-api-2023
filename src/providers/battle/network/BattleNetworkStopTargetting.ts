import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { BattleSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleCycle } from "../BattleCycle";

@provide(BattleNetworkStopTargeting)
export class BattleNetworkStopTargeting {
  constructor(private socketAuth: SocketAuth) {}

  public onBattleStopTargeting(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, BattleSocketEvents.StopTargeting, (data, character) => {
      this.stopTargeting(character);
    });
  }

  public async stopTargeting(character: ICharacter): Promise<void> {
    try {
      if (character) {
        const battleCycle = BattleCycle.battleCycles.get(character.id);

        if (battleCycle) {
          await battleCycle.clear();
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
