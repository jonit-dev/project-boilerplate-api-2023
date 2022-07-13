import { Item, IItem } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath, INPCLoot } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import { NPCTarget } from "./movement/NPCTarget";
import { NPCCycle } from "./NPCCycle";
import _ from "lodash";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";

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
      const npcBody = await this.generateNPCBody(npc);

      // add loot in NPC dead body container
      if (npc.loots) {
        await this.addLootToNPCBody(npcBody, npc.loots);
      }

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

  public generateNPCBody(npc: INPC): Promise<IItem> {
    const blueprintData = itemsBlueprintIndex["npc-body"];

    const npcBody = new Item({
      ...blueprintData, // base body props
      owner: npc._id,
      key: `${npc.key}-body`,
      texturePath: `${npc.textureKey}/death/0.png`,
      textureKey: npc.textureKey,
      name: `${npc.name}'s body`,
      description: `You see ${npc.name}'s body.`,
      scene: npc.scene,
      x: npc.x,
      y: npc.y,
    });

    return npcBody.save();
  }

  private async addLootToNPCBody(npcBody: IItem, loots: INPCLoot[]): Promise<void> {
    // get item container associated with npcBody
    const itemContainer = await ItemContainer.findById(npcBody.itemContainer);
    if (!itemContainer) {
      throw new Error(`Error fetching itemContainer for Item with key ${npcBody.key}`);
    }

    for (const loot of loots) {
      const rand = Math.round(_.random(0, 100));
      if (rand <= loot.chance) {
        const blueprintData = itemsBlueprintIndex[loot.itemBlueprintKey];
        const lootItem = new Item({ ...blueprintData });
        await lootItem.save();

        for (let i = 0; i < itemContainer.slotQty; i++) {
          if (itemContainer.slots[Number(i)] == null) {
            itemContainer.slots[Number(i)] = lootItem._id;
            break;
          }
        }
      }
    }

    itemContainer.markModified("slots");
    await itemContainer.save();
  }
}
