import { ISkill, Skill } from "@entities/ModuleCharacter/SkillsModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { CharacterView } from "@providers/character/CharacterView";
import {
  LOOT_CRAFTING_MATERIAL_DROP_CHANCE,
  LOOT_FOOD_DROP_CHANCE,
  LOOT_GOLD_DROP_CHANCE,
  NPC_LOOT_CHANCE_MULTIPLIER,
} from "@providers/constants/LootConstants";

import { NPC_GIANT_FORM_LOOT_MULTIPLIER } from "@providers/constants/NPCConstants";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { ItemRarity } from "@providers/item/ItemRarity";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath, INPCLoot, ItemSubType, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { NPC_CYCLES } from "./NPCCycle";
import { NPCFreezer } from "./NPCFreezer";
import { calculateGold } from "./NPCGold";
import { NPCSpawn } from "./NPCSpawn";
import { NPCTarget } from "./movement/NPCTarget";

@provide(NPCDeath)
export class NPCDeath {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterView: CharacterView,
    private npcTarget: NPCTarget,
    private itemOwnership: ItemOwnership,
    private itemRarity: ItemRarity,
    private npcFreezer: NPCFreezer,
    private npcSpawn: NPCSpawn
  ) {}

  public async handleNPCDeath(npc: INPC): Promise<void> {
    try {
      // first thing, lets freeze the NPC so it clears all the interval and it stops moving.
      await this.npcFreezer.freezeNPC(npc);

      if (npc.health !== 0) {
        // if by any reason the char is not dead, make sure it is.
        await NPC.updateOne({ _id: npc._id }, { $set: { health: 0 } });
        npc.health = 0;
        npc.isAlive = false;
        await npc.save();
      }

      await this.notifyCharactersOfNPCDeath(npc);
      const npcBody = await this.generateNPCBody(npc);

      const npcWithSkills = await this.getNPCWithSkills(npc);

      const goldLoot = this.getGoldLoot(npcWithSkills) ?? [];

      const npcLoots = (npc.loots as unknown as INPCLoot[]) ?? [];

      await this.addLootToNPCBody(npcBody, [...npcLoots, goldLoot ?? []], npc.isGiantForm);

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
    const skills = await Skill.findById(npc.skills).lean();

    if (!skills) {
      throw new Error(`Skills not found for NPC ${npc.id}`);
    }

    const strengthLevel = skills.strength.level;

    npc.health = 0;

    npc.nextSpawnTime = this.npcSpawn.calculateSpawnTime(strengthLevel);
    npc.currentMovementType = npc.originalMovementType;
    npc.appliedEntityEffects = undefined;
    npc.isBehaviorEnabled = false;
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

  private async addLootToNPCBody(npcBody: IItem, loots: INPCLoot[], wasNpcInGiantForm?: boolean): Promise<void> {
    const itemContainer = await this.fetchItemContainer(npcBody);
    let isDeadBodyLootable = false;

    for (const loot of loots) {
      const rand = Math.round(random(0, 100));
      const lootChance = this.calculateLootChance(loot, wasNpcInGiantForm ? NPC_GIANT_FORM_LOOT_MULTIPLIER : 1);

      if (rand <= lootChance) {
        const lootQuantity = this.getLootQuantity(loot);
        const isStackable = this.isLootItemStackable(loot);

        let freeSlotAvailable = true;
        let remainingLootQuantity = lootQuantity;

        while (remainingLootQuantity > 0 && freeSlotAvailable) {
          const lootItem = await this.createLootItem(loot);
          const freeSlotId = itemContainer.firstAvailableSlotId;
          freeSlotAvailable = freeSlotId !== null;

          if (freeSlotAvailable) {
            if (isStackable) {
              lootItem.stackQty = remainingLootQuantity;
              remainingLootQuantity = 0;
            } else {
              remainingLootQuantity--;
            }

            itemContainer.slots[freeSlotId!] = lootItem;

            await lootItem.save();

            if (!isDeadBodyLootable) {
              await npcBody.updateOne({ isDeadBodyLootable: true });
              isDeadBodyLootable = true;
            }
          }
        }
      }
    }

    itemContainer.markModified("slots");
    await itemContainer.save();
  }

  private async fetchItemContainer(npcBody: IItem): Promise<IItemContainer> {
    const itemContainer = await ItemContainer.findById(npcBody.itemContainer);
    if (!itemContainer) {
      throw new Error(`Error fetching itemContainer for Item with key ${npcBody.key}`);
    }
    return itemContainer;
  }

  private calculateLootChance(loot: INPCLoot, multiplier = 1): number {
    const blueprintData = itemsBlueprintIndex[loot.itemBlueprintKey];
    const lootMultipliers = {
      [OthersBlueprint.GoldCoin]: 1,
      [ItemType.CraftingResource]: LOOT_CRAFTING_MATERIAL_DROP_CHANCE,
      [ItemSubType.Food]: LOOT_FOOD_DROP_CHANCE,
    };
    const lootMultiplier = lootMultipliers[blueprintData?.type] || NPC_LOOT_CHANCE_MULTIPLIER;

    return loot.chance * lootMultiplier * multiplier;
  }

  private getLootQuantity(loot: INPCLoot): number {
    if (loot.quantityRange && loot.quantityRange.length === 2) {
      return Math.round(random(loot.quantityRange[0], loot.quantityRange[1]));
    }
    return 1;
  }

  private isLootItemStackable(loot: INPCLoot): boolean {
    const blueprintData = itemsBlueprintIndex[loot.itemBlueprintKey];
    const lootItem = new Item({ ...blueprintData });

    return lootItem.maxStackSize > 1;
  }

  private async createLootItem(loot: INPCLoot): Promise<IItem> {
    const blueprintData = itemsBlueprintIndex[loot.itemBlueprintKey];
    let lootItem = new Item({ ...blueprintData });

    if (lootItem.attack || lootItem.defense) {
      const rarityAttributes = this.itemRarity.setItemRarityOnLootDrop(lootItem);
      lootItem = new Item({
        ...blueprintData,
        attack: rarityAttributes.attack,
        defense: rarityAttributes.defense,
        rarity: rarityAttributes.rarity,
      });
    }

    return await lootItem.save();
  }
}
