import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { BattleSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleCharacterManager } from "../BattleCharacterManager";

@provide(BattleNetworkStopTargeting)
export class BattleNetworkStopTargeting {
  constructor(private socketAuth: SocketAuth) {}

  public onBattleStopTargeting(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, BattleSocketEvents.StopTargeting, (data, character) => {
      this.stopTargeting(character);
    });
  }

  private async stopTargeting(character: ICharacter): Promise<void> {
    try {
      if (character) {
        const battleCycle = BattleCharacterManager.battleCycles.get(character.id);

        if (battleCycle) {
          battleCycle.clear();
          BattleCharacterManager.battleCycles.delete(character.id);

          await Character.updateOne(
            { _id: character._id },
            {
              $unset: {
                target: 1,
              },
            }
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
