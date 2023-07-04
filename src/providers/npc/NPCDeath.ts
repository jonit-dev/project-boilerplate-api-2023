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

import { TrackNewRelicTransaction } from "@providers/analytics/decorator/TrackNewRelicTransaction";
import { NPC_GIANT_FORM_LOOT_MULTIPLIER } from "@providers/constants/NPCConstants";
import { blueprintManager } from "@providers/inversify/container";
import { ItemOwnership } from "@providers/item/ItemOwnership";
import { ItemRarity } from "@providers/item/ItemRarity";
import { AvailableBlueprints, OthersBlueprint } from "@providers/item/data/types/itemsBlueprintTypes";
import { Locker } from "@providers/locks/Locker";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { BattleSocketEvents, IBattleDeath, INPCLoot, ItemSubType, ItemType } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import random from "lodash/random";
import { NPC_CYCLES } from "./NPCCycle";
import { NPCExperience } from "./NPCExperience/NPCExperience";
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
    private npcSpawn: NPCSpawn,
    private npcExperience: NPCExperience,
    private locker: Locker
  ) {}

  @TrackNewRelicTransaction()
  public async handleNPCDeath(npc: INPC): Promise<void> {
    await this.npcFreezer.freezeNPC(npc);

    const hasLocked = await this.locker.lock(`npc-death-${npc._id}`);

    if (!hasLocked) {
      return;
    }

    try {
      console.log("NPCDeath for npc: ", npc.key);

      if (npc.health !== 0) {
        const setHealthToZero = NPC.updateOne({ _id: npc._id }, { $set: { health: 0 } });
        npc.health = 0;
        npc.isAlive = false;
        const saveNPC = npc.save();

        await Promise.all([setHealthToZero, saveNPC]);
      }

      const npcBody = await this.generateNPCBody(npc);

      if (!npcBody) {
        return;
      }

      const notifyCharactersOfNPCDeath = this.notifyCharactersOfNPCDeath(npc);

      const npcWithSkills = await this.getNPCWithSkills(npc);

      const goldLoot = this.getGoldLoot(npcWithSkills);

      const npcLoots = npc.loots as unknown as INPCLoot[];

      const addLootToNPCBody = this.addLootToNPCBody(npcBody, [...npcLoots, goldLoot], npc.isGiantForm);

      const removeItemOwnership = this.itemOwnership.removeItemOwnership(npcBody.id);

      const clearNPCBehavior = this.clearNPCBehavior(npc);

      const updateNPCAfterDeath = this.updateNPCAfterDeath(npcWithSkills);

      const releaseXP = this.npcExperience.releaseXP(npc as INPC);

      await Promise.all([
        notifyCharactersOfNPCDeath,
        npcWithSkills,
        goldLoot,
        addLootToNPCBody,
        removeItemOwnership,
        clearNPCBehavior,
        updateNPCAfterDeath,
        releaseXP,
      ]);
    } catch (error) {
      console.error(error);
    }
  }

  private async notifyCharactersOfNPCDeath(npc: INPC): Promise<void> {
    const nearbyCharacters = await this.characterView.getCharactersAroundXYPosition(npc.x, npc.y, npc.scene);

    const notifications = nearbyCharacters.map((nearbyCharacter) =>
      this.socketMessaging.sendEventToUser<IBattleDeath>(nearbyCharacter.channelId!, BattleSocketEvents.BattleDeath, {
        id: npc.id,
        type: "NPC",
      })
    );

    await Promise.all(notifications);
  }

  private async getNPCWithSkills(npc: INPC): Promise<INPC> {
    const npcFound = (await NPC.findById(npc._id).lean({
      virtuals: true,
      defaults: true,
    })) as INPC;

    if (!npcFound) {
      throw new Error(`NPC not found with id ${npc._id}`);
    }

    const npcSkills = (await Skill.findById(npc.skills)
      .lean({
        virtuals: true,
        defaults: true,
      })
      .cacheQuery({
        cacheKey: `${npc._id}-skills`,
      })) as ISkill;

    npcFound.skills = npcSkills;

    return npcFound;
  }

  private async updateNPCAfterDeath(npc: INPC): Promise<void> {
    const skills = npc.skills as ISkill;

    const strengthLevel = skills.strength.level;

    const nextSpawnTime = this.npcSpawn.calculateSpawnTime(strengthLevel);
    const currentMovementType = npc.originalMovementType;

    await NPC.updateOne(
      { _id: npc.id },
      {
        $set: {
          health: 0,
          nextSpawnTime,
          currentMovementType: currentMovementType,
          appliedEntityEffects: undefined,
          isBehaviorEnabled: false,
        },
      }
    );
  }

  @TrackNewRelicTransaction()
  public async generateNPCBody(npc: INPC): Promise<IItem | undefined> {
    const hasLock = await this.locker.lock(`npc-body-generation-${npc._id}`);

    if (!hasLock) {
      return;
    }

    const blueprintData = await blueprintManager.getBlueprint<IItem>("items", "npc-body" as AvailableBlueprints);
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

    const bulkOps: any[] = [];

    for (const loot of loots) {
      const rand = Math.round(random(0, 100));
      const lootChance = await this.calculateLootChance(loot, wasNpcInGiantForm ? NPC_GIANT_FORM_LOOT_MULTIPLIER : 1);

      if (rand <= lootChance) {
        const lootQuantity = this.getLootQuantity(loot);
        const isStackable = await this.isLootItemStackable(loot);

        let remainingLootQuantity = lootQuantity;

        while (remainingLootQuantity > 0) {
          const lootItem = await this.createLootItemWithoutSaving(loot);
          const freeSlotId = itemContainer.firstAvailableSlotId;

          if (freeSlotId === null) {
            break;
          }

          if (isStackable) {
            lootItem.stackQty = remainingLootQuantity;
            remainingLootQuantity = 0;
          } else {
            remainingLootQuantity--;
          }

          itemContainer.slots[freeSlotId] = lootItem;
          bulkOps.push({ insertOne: { document: lootItem } });

          if (!isDeadBodyLootable) {
            npcBody.isDeadBodyLootable = true;
            isDeadBodyLootable = true;
          }
        }
      }
    }

    if (bulkOps.length > 0) {
      await Item.bulkWrite(bulkOps);
    }

    itemContainer.markModified("slots");
    await ItemContainer.updateOne({ _id: itemContainer._id }, itemContainer);
    await Item.updateOne({ _id: npcBody._id }, npcBody);
  }

  private async createLootItemWithoutSaving(loot: INPCLoot): Promise<IItem> {
    const blueprintData = await blueprintManager.getBlueprint<IItem>(
      "items",
      loot.itemBlueprintKey as AvailableBlueprints
    );

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

    return lootItem;
  }

  private async fetchItemContainer(npcBody: IItem): Promise<IItemContainer> {
    const itemContainer = await ItemContainer.findById(npcBody.itemContainer);
    if (!itemContainer) {
      throw new Error(`Error fetching itemContainer for Item with key ${npcBody.key}`);
    }
    return itemContainer;
  }

  private async calculateLootChance(loot: INPCLoot, multiplier = 1): Promise<number> {
    const blueprintData = await blueprintManager.getBlueprint<IItem>(
      "items",
      loot.itemBlueprintKey as AvailableBlueprints
    );
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

  private async isLootItemStackable(loot: INPCLoot): Promise<boolean> {
    const blueprintData = await blueprintManager.getBlueprint<IItem>(
      "items",
      loot.itemBlueprintKey as AvailableBlueprints
    );
    const lootItem = new Item({ ...blueprintData });

    return lootItem.maxStackSize > 1;
  }
}
