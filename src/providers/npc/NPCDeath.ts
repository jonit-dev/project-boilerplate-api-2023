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
    } else {
      throw new Error("NPC behavior cycle not found in npcCycles");
    }

    await this.npcTarget.clearTarget(npc);

    npc.nextSpawnTime = dayjs(new Date()).add(npc.spawnIntervalMin, "minutes").toDate();

    npc.currentMovementType = npc.originalMovementType; // restart original movement;

    await npc.save();
  }

  public async generateNPCBody(npc: INPC): Promise<void> {
    const blueprintData = itemsBlueprintIndex["female-npc-body"];

    const npcBody = new Item({
      ...blueprintData,
      name: `${npc.name}'s body`,
      scene: npc.scene,
      x: npc.x,
      y: npc.y,
    });

    await npcBody.save();
  }
}
