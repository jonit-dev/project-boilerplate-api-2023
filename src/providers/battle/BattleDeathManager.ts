import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, CharacterSocketEvents, IBattleDeath } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(BattleDeathManager)
export class BattleDeathManager {
  constructor(private socketMessaging: SocketMessaging) {}

  public async handleCharacterDeath(character: ICharacter): Promise<void> {
    console.log(`Character ${character.name} is dead`);

    // send event to the character that is dead

    this.socketMessaging.sendEventToUser<IBattleDeath>(character.channelId!, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });

    //! TODO: Create a body (item) serverside

    // communicate all players around that character is dead

    await this.socketMessaging.sendMessageToCloseCharacters<IBattleDeath>(character, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });

    // finally, force disconnect character that is dead.

    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
      reason: "💀 You're dead 💀",
    });
  }

  public async handleNPCDeath(npc: INPC): Promise<void> {}
}
