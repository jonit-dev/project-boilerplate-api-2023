import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, CharacterSocketEvents, IBattleDeath } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(BattleDeathManager)
export class BattleDeathManager {
  constructor(private socketMessaging: SocketMessaging, private characterDeath: CharacterDeath) {}

  public async handleCharacterDeath(character: ICharacter): Promise<void> {
    console.log(`Character ${character.name} is dead`);

    // send event to the character that is dead

    this.socketMessaging.sendEventToUser<IBattleDeath>(character.channelId!, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });
    // communicate all players around that character is dead

    await this.socketMessaging.sendMessageToCloseCharacters<IBattleDeath>(character, BattleSocketEvents.BattleDeath, {
      id: character.id,
      type: "Character",
    });

    // generate character's body

    await this.characterDeath.generateCharacterBody(character);

    // Restart health and X,Y after death.
    await this.characterDeath.respawnCharacter(character);

    // finally, force disconnect character that is dead.
    this.socketMessaging.sendEventToUser(character.channelId!, CharacterSocketEvents.CharacterForceDisconnect, {
      reason: "💀 You're dead 💀",
    });

    // TODO: Add death penalty here.
  }

  public async handleNPCDeath(npc: INPC): Promise<void> {}
}
