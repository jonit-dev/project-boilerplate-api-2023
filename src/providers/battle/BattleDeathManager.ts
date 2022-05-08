import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleCharacterDeath } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(BattleDeath)
export class BattleDeath {
  constructor(private socketMessaging: SocketMessaging) {}

  public async handleCharacterDeath(character: ICharacter): Promise<void> {
    console.log(`Character ${character.name} is dead`);

    // send event to the character that is dead

    await this.socketMessaging.sendEventToUser<IBattleCharacterDeath>(
      character.channelId!,
      BattleSocketEvents.CharacterDeath,
      { charId: character.id }
    );

    // communicate all players around that character is dead

    await this.socketMessaging.sendMessageToCloseCharacters<IBattleCharacterDeath>(
      character,
      BattleSocketEvents.CharacterDeath,
      {
        charId: character.id,
      }
    );
  }
}
