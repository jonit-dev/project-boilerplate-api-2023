import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleCharacterDeath } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(BattleDeathManager)
export class BattleDeathManager {
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

  public async handleNPCDeath(npc: INPC): Promise<void> {}
}
