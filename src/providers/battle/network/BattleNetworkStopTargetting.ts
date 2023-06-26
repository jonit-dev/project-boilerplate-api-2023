import { Character, ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Locker } from "@providers/locks/Locker";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import { BattleSocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { BattleCycle } from "../BattleCycle";

@provide(BattleNetworkStopTargeting)
export class BattleNetworkStopTargeting {
  constructor(private socketAuth: SocketAuth, private locker: Locker) {}

  public onBattleStopTargeting(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, BattleSocketEvents.StopTargeting, async (data, character) => {
      await this.stopTargeting(character);
    });
  }

  public async stopTargeting(character: ICharacter): Promise<void> {
    try {
      if (character) {
        await Character.updateOne({ _id: character._id }, { $unset: { target: 1 } });

        const battleCycle = BattleCycle.battleCycles.get(character.id);

        if (battleCycle) {
          await battleCycle.clear();
        }

        await this.locker.unlock(`character-${character._id}-battle-targeting`);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
