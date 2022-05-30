import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterDeath } from "@providers/character/CharacterDeath";
import { CharacterView } from "@providers/character/CharacterView";
import { NPCCycle } from "@providers/npc/NPCCycle";
import { NPCDeath } from "@providers/npc/NPCDeath";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, CharacterSocketEvents, IBattleDeath } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";

@provide(BattleDeathManager)
export class BattleDeathManager {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterDeath: CharacterDeath,
    private npcDeath: NPCDeath,
    private characterView: CharacterView
  ) {}

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

  public async handleNPCDeath(npc: INPC): Promise<void> {
    // warn characters around about the NPC's death
    const nearbyCharacters = await this.characterView.getCharactersAroundXYPosition(npc.x, npc.y, npc.scene);

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser<IBattleDeath>(nearbyCharacter.channelId!, BattleSocketEvents.BattleDeath, {
        id: npc.id,
        type: "NPC",
      });
    }

    // create NPC body instance
    await this.npcDeath.generateNPCBody(npc);

    // disable NPC behavior

    const npcCycle = NPCCycle.npcCycles.get(npc.id);

    if (npcCycle) {
      npcCycle.clear();
    } else {
      throw new Error("NPC behavior cycle not found in npcCycles");
    }

    // clear npc target
    npc.targetCharacter = undefined;

    npc.nextSpawnTime = dayjs(new Date()).add(npc.spawnIntervalMin, "minutes").toDate();

    await npc.save();
  }
}
