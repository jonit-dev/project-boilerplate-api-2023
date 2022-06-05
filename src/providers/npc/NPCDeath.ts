import { Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import { NPCTarget } from "./movement/NPCTarget";
import { NPCCycle } from "./NPCCycle";

@provide(NPCDeath)
export class NPCDeath {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private npcTarget: NPCTarget
  ) {}

  public async handleNPCDeath(npc: INPC): Promise<void> {
    try {
      // warn characters around about the NPC's death
      const nearbyCharacters = await this.characterView.getCharactersAroundXYPosition(npc.x, npc.y, npc.scene);

      for (const nearbyCharacter of nearbyCharacters) {
        this.socketMessaging.sendEventToUser<IBattleDeath>(nearbyCharacter.channelId!, BattleSocketEvents.BattleDeath, {
          id: npc.id,
          type: "NPC",
        });
      }

      // create NPC body instance
      await this.generateNPCBody(npc);

      // disable NPC behavior

      const npcCycle = NPCCycle.npcCycles.get(npc.id);

      if (npcCycle) {
        npcCycle.clear();
      }

      await this.npcTarget.clearTarget(npc);

      npc.health = 0; // guarantee that he's dead when this method is called =)

      npc.nextSpawnTime = dayjs(new Date()).add(npc.spawnIntervalMin, "minutes").toDate();

      npc.currentMovementType = npc.originalMovementType; // restart original movement;

      await npc.save();
    } catch (error) {
      console.error(error);
    }
  }

  public async generateNPCBody(npc: INPC): Promise<void> {
    const blueprintData = itemsBlueprintIndex["npc-body"];

    const npcBody = new Item({
      ...blueprintData, // base body props
      key: `${npc.key}-body`,
      texturePath: `${npc.textureKey}/death/${npc.textureKey}.png`,
      textureKey: npc.textureKey,
      name: `${npc.name}'s body`,
      description: `You see ${npc.name}'s body.`,
      scene: npc.scene,
      x: npc.x,
      y: npc.y,
    });

    await npcBody.save();
  }
}
