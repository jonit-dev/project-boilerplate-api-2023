import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath, INPCLoot } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import _, { random } from "lodash";
import { NPC_CYCLES } from "./NPCCycle";
import { calculateGold } from "./NPCGold";
import { NPCTarget } from "./movement/NPCTarget";

@provide(NPCDeath)
export class NPCDeath {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private npcTarget: NPCTarget
  ) {}

  public async handleNPCDeath(npc: INPC, character: ICharacter | null): Promise<void> {
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
      let goldLoot;
      const npcBody = await this.generateNPCBody(npc, character);

      if (npc.loots) {
        const npcSkills = await npc.populate("skills").execPopulate();

        goldLoot = this.getGoldLoot(npcSkills);

        // add loot in NPC dead body container
      }
      await this.addLootToNPCBody(npcBody, [...(npc?.loots ?? []), goldLoot ?? []]);

      await this.clearNPCBehavior(npc);

      npc.health = 0; // guarantee that he's dead when this method is called =)
      npc.nextSpawnTime = dayjs(new Date()).add(npc.spawnIntervalMin, "minutes").toDate();
      npc.currentMovementType = npc.originalMovementType; // restart original movement;
      await npc.save();
    } catch (error) {
      console.error(error);
    }
  }

  public generateNPCBody(npc: INPC, character: ICharacter | null): Promise<IItem> {
    const blueprintData = itemsBlueprintIndex["npc-body"];
    const npcBody = new Item({
      ...blueprintData, // base body props
      key: `${npc.key}-body`,
      bodyFromId: npc.id,
      // owner: character ? character.id : null,
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

  private async clearNPCBehavior(npc: INPC): Promise<void> {
    const npcCycle = NPC_CYCLES.get(npc.id);

    if (npcCycle) {
      await npcCycle.clear();
    }

    await this.npcTarget.clearTarget(npc);
  }

  private getGoldLoot(npc: INPC): INPCLoot {
    if (!npc.skills) {
      throw new Error(`Error while calculating gold loot for NPC with key ${npc.key}: NPC has no skills.`);
    }

    const calculatedGold = calculateGold(npc.maxHealth, npc?.skills as unknown as Partial<ISkill>);
    const randomPercentage = (): number => random(70, 100) / 100;
    const goldLoot: INPCLoot = {
      chance: 30,
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      quantityRange: [Math.floor(randomPercentage() * calculatedGold), Math.floor(calculatedGold)],
    };

    return goldLoot;
  }

  private async addLootToNPCBody(npcBody: IItem, loots: INPCLoot[]): Promise<void> {
    // get item container associated with npcBody
    const itemContainer = await ItemContainer.findById(npcBody.itemContainer);
    if (!itemContainer) {
      throw new Error(`Error fetching itemContainer for Item with key ${npcBody.key}`);
    }

    let freeSlotAvailable = true;
    for (const loot of loots) {
      if (!freeSlotAvailable) {
        break;
      }

      const rand = Math.round(_.random(0, 100));
      if (rand <= loot.chance) {
        const blueprintData = itemsBlueprintIndex[loot.itemBlueprintKey];

        let lootQuantity = 1;
        // can specify a loot quantity range, e.g. 5-10 coins.
        // So need to add that quantity to the body container
        if (loot.quantityRange && loot.quantityRange.length === 2) {
          lootQuantity = Math.round(_.random(loot.quantityRange[0], loot.quantityRange[1]));
        }

        const lootItem = new Item({ ...blueprintData });
        // stackable items - only add 1 item and set stack qty = lootQty
        if (lootItem.maxStackSize > 1) {
          if (lootQuantity > lootItem.maxStackSize) {
            throw new Error(
              `Loot quantity of ${lootQuantity} is higher than max stack size for item ${lootItem.key}, which is ${lootItem.maxStackSize}`
            );
          }

          lootItem.stackQty = lootQuantity;
          await lootItem.save();

          const freeSlotId = itemContainer.firstAvailableSlotId;
          freeSlotAvailable = freeSlotId !== null;

          if (!freeSlotAvailable) {
            break;
          }
          itemContainer.slots[freeSlotId!] = lootItem;
        } else {
          while (lootQuantity > 0) {
            const lootItem = new Item({ ...blueprintData });
            await lootItem.save();

            const freeSlotId = itemContainer.firstAvailableSlotId;
            freeSlotAvailable = freeSlotId !== null;

            if (!freeSlotAvailable) {
              break;
            }

            itemContainer.slots[freeSlotId!] = lootItem;

            lootQuantity--;
          }
        }
      }
    }

    itemContainer.markModified("slots");
    await itemContainer.save();
  }
}
