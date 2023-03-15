import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { ISkill } from "@entities/ModuleCharacter/SkillsModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import {
  LOOT_CRAFTING_MATERIAL_DROP_CHANCE,
  LOOT_FOOD_DROP_CHANCE,
  LOOT_GOLD_DROP_CHANCE,
  NPC_LOOT_CHANCE_MULTIPLIER,
} from "@providers/constants/LootConstants";

import { ItemOwnership } from "@providers/item/ItemOwnership";
import { ItemRarity } from "@providers/item/ItemRarity";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath, INPCLoot, ItemSubType, ItemType } from "@rpg-engine/shared";
import dayjs from "dayjs";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { NPC_CYCLES } from "./NPCCycle";
import { calculateGold } from "./NPCGold";
import { NPCTarget } from "./movement/NPCTarget";

@provide(NPCDeath)
export class NPCDeath {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private npcTarget: NPCTarget,
    private itemOwnership: ItemOwnership,
    private itemRarity: ItemRarity
  ) {}

  public async handleNPCDeath(npc: INPC, character: ICharacter | null): Promise<void> {
    try {
      await this.notifyCharactersOfNPCDeath(npc);
      const npcBody = await this.generateNPCBody(npc);

      const npcWithSkills = await this.getNPCWithSkills(npc);

      const goldLoot = this.getGoldLoot(npcWithSkills) ?? [];

      const npcLoots = (npc.loots as unknown as INPCLoot[]) ?? [];

      await this.addLootToNPCBody(npcBody, [...npcLoots, goldLoot ?? []]);

      await this.itemOwnership.removeItemOwnership(npcBody.id);
      await this.clearNPCBehavior(npc);

      await this.updateNPCAfterDeath(npc);
    } catch (error) {
      console.error(error);
    }
  }

  private async notifyCharactersOfNPCDeath(npc: INPC): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersAroundXYPosition(npc.x, npc.y, npc.scene);

    for (const nearbyCharacter of nearbyCharacters) {
      this.socketMessaging.sendEventToUser<IBattleDeath>(nearbyCharacter.channelId!, BattleSocketEvents.BattleDeath, {
        id: npc.id,
        type: "NPC",
      });
    }
  }

  private async getNPCWithSkills(npc: INPC): Promise<INPC> {
    return await npc.populate("skills").execPopulate();
  }

  private async updateNPCAfterDeath(npc: INPC): Promise<void> {
    npc.health = 0;
    npc.nextSpawnTime = dayjs(new Date()).add(npc.spawnIntervalMin, "minutes").toDate();
    npc.currentMovementType = npc.originalMovementType;
    await npc.save();
  }

  public async generateNPCBody(npc: INPC): Promise<IItem> {
    const blueprintData = itemsBlueprintIndex["npc-body"];
    const npcBody = new Item({
      ...blueprintData, // base body props
      key: `${npc.key}-body`,
      bodyFromId: npc.id,
      texturePath: `${npc.textureKey}/death/0.png`,
      textureKey: npc.textureKey,
      name: `${npc.name}'s body`,
      description: `You see ${npc.name}'s body.`,
      scene: npc.scene,
      x: npc.x,
      y: npc.y,
    });

    return await npcBody.save();
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
      chance: LOOT_GOLD_DROP_CHANCE * 100,
      itemBlueprintKey: OthersBlueprint.GoldCoin,
      quantityRange: [1 + Math.floor(randomPercentage() * calculatedGold), Math.floor(calculatedGold)],
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

      const rand = Math.round(random(0, 100));
      const blueprintData = itemsBlueprintIndex[loot.itemBlueprintKey];

      let lootChance = loot.chance;

      if (loot.itemBlueprintKey === OthersBlueprint.GoldCoin) {
        lootChance = loot.chance;
      } else if (blueprintData?.type === ItemType.CraftingResource) {
        lootChance = loot.chance * LOOT_CRAFTING_MATERIAL_DROP_CHANCE; // crafting materials not impacted by NPC_LOOT_CHANCE_MULTIPLIER
      } else if (blueprintData?.type === ItemSubType.Food) {
        lootChance = loot.chance * LOOT_FOOD_DROP_CHANCE;
      } else {
        lootChance = loot.chance * NPC_LOOT_CHANCE_MULTIPLIER;
      }

      if (rand <= lootChance) {
        let lootQuantity = 1;
        // can specify a loot quantity range, e.g. 5-10 coins.
        // So need to add that quantity to the body container
        if (loot.quantityRange && loot.quantityRange.length === 2) {
          lootQuantity = Math.round(random(loot.quantityRange[0], loot.quantityRange[1]));
        }

        let lootItem = new Item({ ...blueprintData });
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
            if (lootItem.attack || lootItem.defense) {
              const rarityAttributes = this.itemRarity.setItemRarityOnLootDrop(lootItem);
              lootItem = new Item({
                ...blueprintData,
                attack: rarityAttributes.attack,
                defense: rarityAttributes.defense,
                rarity: rarityAttributes.rarity,
              });
              await lootItem.save();
            } else {
              lootItem = new Item({
                ...blueprintData,
              });
              await lootItem.save();
            }

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
