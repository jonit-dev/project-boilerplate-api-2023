import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem as IItemModel, Item } from "@entities/ModuleInventory/ItemModel";
import { IQuest as IQuestModel, Quest } from "@entities/ModuleQuest/QuestModel";
import {
  IQuestObjectiveInteraction,
  IQuestObjectiveKill,
  QuestObjectiveInteraction,
  QuestObjectiveKill,
} from "@entities/ModuleQuest/QuestObjectiveModel";
import { IQuestRecord, QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { IQuestReward, QuestReward } from "@entities/ModuleQuest/QuestRewardModel";
import { CharacterItems, IItemByKeyResult } from "@providers/character/characterItems/CharacterItems";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import { blueprintManager } from "@providers/inversify/container";
import { AvailableBlueprints } from "@providers/item/data/types/itemsBlueprintTypes";
import { ItemDrop } from "@providers/item/ItemDrop";
import { MovementHelper } from "@providers/movement/MovementHelper";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import {
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  IItemContainer,
  IQuest,
  IQuestsResponse,
  ItemSocketEvents,
  IUIShowMessage,
  QuestSocketEvents,
  QuestStatus,
  QuestType,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

interface IGetObjectivesResult {
  objectives: IQuestObjectiveInteraction[] | IQuestObjectiveKill[];
  records: IQuestRecord[];
}

interface IConsumeCharacterItem extends IItemByKeyResult {
  isStackable?: boolean;
  decrementQty?: number;
}

@provide(QuestSystem)
export class QuestSystem {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterWeight: CharacterWeight,
    private equipmentSlots: EquipmentSlots,
    private movementHelper: MovementHelper,
    private itemDrop: ItemDrop,
    private characterItems: CharacterItems
  ) {}

  public async updateQuests(type: QuestType, character: ICharacter, targetKey: string): Promise<void> {
    const objectivesData = await this.getObjectivesData(character, type);
    if (_.isEmpty(objectivesData)) {
      return;
    }

    let updatedQuest: IQuestModel | undefined;
    switch (type) {
      case QuestType.Kill:
        updatedQuest = await this.updateKillObjective(objectivesData, targetKey);
        break;
      case QuestType.Interaction:
        updatedQuest = await this.updateInteractionObjective(objectivesData, targetKey, character);
        break;
      default:
        throw new Error(`Invalid quest type ${type}`);
    }

    if (!updatedQuest) {
      return;
    }

    if (await updatedQuest.hasStatus(QuestStatus.Completed, character.id)) {
      await this.releaseRewards(updatedQuest as unknown as IQuest, character);
    }
  }

  private async getObjectivesData(
    character: ICharacter,
    type: QuestType,
    status = QuestStatus.InProgress
  ): Promise<IGetObjectivesResult> {
    const questRecords = await QuestRecord.find({ character: character.id, status });

    if (!questRecords.length) {
      return {} as IGetObjectivesResult;
    }

    switch (type) {
      case QuestType.Interaction:
        return {
          objectives: await QuestObjectiveInteraction.find({
            _id: { $in: questRecords.map((r) => r.objective) },
          }),
          records: questRecords,
        };

      case QuestType.Kill:
        return {
          objectives: await QuestObjectiveKill.find({
            _id: { $in: questRecords.map((r) => r.objective) },
          }),
          records: questRecords,
        };
      default:
        throw new Error(`invalid quest type: ${type}`);
    }
  }

  /**
   * This function updates the kill objective of a quest if creatureKey is
   * within the creatureKey array of one of the objectives. In such case,
   * returns the quest that is owner to the updated objective. If none is updated,
   * returns undefined
   *
   * @param data quest objective data for the character
   * @param creatureKey key of the creature killed
   */
  private async updateKillObjective(data: IGetObjectivesResult, creatureKey: string): Promise<IQuestModel | undefined> {
    // check for each objective if the creature key is within their
    // creatureKey array. If many cases, only update the first one

    const baseCreatureKey = creatureKey.replace(/-\d+$/, "");

    for (const i in data.objectives) {
      const obj = data.objectives[i] as IQuestObjectiveKill;
      if (obj.creatureKeys!.indexOf(baseCreatureKey) > -1) {
        // get the quest record for the character
        const record = data.records.filter((r) => r.objective.toString() === obj._id.toString());
        if (!record.length) {
          throw new Error("Character hasn't started this quest");
        }

        record[0].killCount!++;
        if (record[0].killCount === obj.killCountTarget) {
          record[0].status = QuestStatus.Completed;
        }

        await record[0].save();
        return (await Quest.findById(record[0].quest)) as IQuestModel;
      }
    }
    return undefined;
  }

  /**
   * This function updates the interaction objective of a quest if npcKey is
   * equal to the targetNPCkey of one of the objectives. In such case,
   * returns the quest that is owner to the updated objective. If none is updated,
   * returns undefined
   *
   * @param data objectives data of interaction objectives
   * @param npcKey key of npc that the charater interacted with
   * @param character character data used to check if has required items in case the interaction quest has defined 'itemsKeys' field
   */
  private async updateInteractionObjective(
    data: IGetObjectivesResult,
    npcKey: string,
    character: ICharacter
  ): Promise<IQuestModel | undefined> {
    // check for each objective if the npc key is the correspondiong npc
    // If many cases, only update the first one
    for (const i in data.objectives) {
      let objCompleted = false;

      const obj = data.objectives[i] as IQuestObjectiveInteraction;

      // get the quest record for the character
      const record = data.records.filter((r) => r.objective.toString() === obj._id.toString());
      if (!record.length) {
        throw new Error("Character hasn't started this quest");
      }

      if (obj.targetNPCkey! === npcKey.split("-")[0]) {
        objCompleted = true;
      }
      // check if the obj has 'items' field defined
      // then check if character has the required items to complete the quest
      if (!_.isEmpty(obj.items)) {
        const foundItems: IConsumeCharacterItem[] = [];
        for (const i of obj.items!) {
          // if does not have all items, no update is done
          const foundItem = (await this.characterItems.hasItemByKey(i.itemKey, character, "both")) as
            | IConsumeCharacterItem
            | undefined;
          if (!foundItem) {
            return;
          }
          const item = await Item.findById(foundItem.itemId);
          // if is stackable item and does not have the required amount, no update is done
          if (i.qty > 1 && (!item?.maxStackSize || (item?.stackQty || 0) < i.qty)) {
            return;
          }
          foundItem.isStackable = !!item?.maxStackSize;
          foundItem.decrementQty = i.qty;
          foundItems.push(foundItem);
        }

        // character contains all items
        // remove them from the character's equipment and set obj as completed
        for (const found of foundItems) {
          let removed = false;
          // for stackable items, remove only the corresponding qty
          if (found.isStackable) {
            removed = await this.characterItems.decrementItemFromContainer(
              found.itemId!,
              character,
              // @ts-ignore
              found.container,
              found.decrementQty
            );
          } else {
            removed = await this.characterItems.deleteItemFromContainer(
              found.itemId!,
              character,
              // @ts-ignore
              found.container
            );
          }
          if (!removed) {
            return;
          }
        }
        // delete if corresponds (no stackable items)
        await Item.deleteMany({ _id: { $in: foundItems.filter((i) => !i.isStackable).map((i) => i.itemId) } });
        objCompleted = true;
      }

      if (objCompleted) {
        // update the quest status to Completed
        record[0].status = QuestStatus.Completed;
        await record[0].save();
        return (await Quest.findById(record[0].quest)) as IQuestModel;
      }
    }
    return undefined;
  }

  private async releaseRewards(quest: IQuest, character: ICharacter): Promise<void> {
    const rewards = await QuestReward.find({ _id: { $in: quest.rewards } });

    // Get character's backpack to store there the rewards
    // TODO: Cache this
    const equipment = await Equipment.findById(character.equipment).populate("inventory").exec();
    if (!equipment) {
      throw new Error(
        `Character equipment not found. Character id ${character.id}, Equipment id ${character.equipment}`
      );
    }
    const backpack = equipment.inventory as unknown as IItem;
    const backpackContainer = await ItemContainer.findById(backpack.itemContainer);
    if (!backpackContainer) {
      throw new Error(
        `Character item container not found. Character id ${character.id}, ItemContainer id ${backpack.itemContainer}`
      );
    }

    try {
      const overflowingRewards: IItemModel[] = [];
      for (const reward of rewards) {
        overflowingRewards.push(
          ...(await this.releaseItemRewards(reward, backpackContainer as unknown as IItemContainer))
        );
        // TODO implement when spells are supported
        // await this.releaseSpellRewards(reward, backpackContainer);
      }

      if (!_.isEmpty(overflowingRewards)) {
        // drop items on the floor
        // 1. get nearby grid points without solids
        const gridPoints = await this.movementHelper.getNearbyGridPoints(character, overflowingRewards.length);
        // 2. drop items on those grid points
        await this.itemDrop.dropItems(overflowingRewards, gridPoints, character.scene);
      }

      backpackContainer.markModified("slots");
      await backpackContainer.save();

      await this.characterWeight.updateCharacterWeight(character);

      const equipmentSlots = await this.equipmentSlots.getEquipmentSlots(character.equipment!.toString());

      const inventory: IItemContainer = {
        _id: backpackContainer._id,
        parentItem: backpackContainer.parentItem.toString(),
        owner: backpackContainer.owner?.toString() || character.name,
        name: backpackContainer.name,
        slotQty: backpackContainer.slotQty,
        slots: backpackContainer.slots,
        isEmpty: backpackContainer.isEmpty,
      };

      const payloadUpdate: IEquipmentAndInventoryUpdatePayload = {
        equipment: equipmentSlots,
        inventory: inventory,
        openEquipmentSetOnUpdate: false,
        openInventoryOnUpdate: true,
      };

      this.sendQuestCompletedEvents(quest, character, payloadUpdate);
    } catch (err) {
      console.log(err);
      throw new Error("An unexpected error ocurred, check the logs for more information");
    }
  }

  /**
   * Release the rewards in character's item container
   * If no more space left, returns an array with the overflowing items
   * @param reward quest reward data
   * @param itemContainer character's item container
   * @returns array of overflowing reward items that could not be placed on charater's item container
   */
  private async releaseItemRewards(reward: IQuestReward, itemContainer: IItemContainer): Promise<IItemModel[]> {
    const overflowingRewards: IItemModel[] = [];
    if (!reward.itemKeys) {
      return overflowingRewards;
    }

    for (const itemKey of reward.itemKeys) {
      const blueprintData = await blueprintManager.getBlueprint<IItem>("items", itemKey as AvailableBlueprints);

      for (let i = 0; i < reward.qty; i++) {
        let rewardItem = new Item({ ...blueprintData });

        if (rewardItem.maxStackSize > 1) {
          if (reward.qty > rewardItem.maxStackSize) {
            throw new Error(
              `Loot quantity of ${rewardItem.key} is higher than max stack size for item ${rewardItem.name}, which is ${rewardItem.maxStackSize}`
            );
          }

          rewardItem.stackQty = reward.qty;
        }

        rewardItem = await rewardItem.save();

        const freeSlotId = itemContainer.firstAvailableSlotId;
        const freeSlotAvailable = freeSlotId !== null;

        if (!freeSlotAvailable) {
          // if character has no more space on backpack
          // return the remaining reward items
          overflowingRewards.push(rewardItem);
        } else {
          itemContainer.slots[freeSlotId!] = rewardItem as unknown as IItem;
        }

        if (rewardItem.maxStackSize > 1) {
          break;
        }
      }
    }
    return overflowingRewards;
  }

  private sendQuestCompletedEvents(
    quest: IQuest,
    character: ICharacter,
    payloadUpdate: IEquipmentAndInventoryUpdatePayload
  ): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: `You have completed the quest '${quest.title}'!`,
      type: "info",
    });

    this.socketMessaging.sendEventToUser<IEquipmentAndInventoryUpdatePayload>(
      character.channelId!,
      ItemSocketEvents.EquipmentAndInventoryUpdate,
      payloadUpdate
    );

    this.socketMessaging.sendEventToUser<IQuestsResponse>(character.channelId!, QuestSocketEvents.Completed, {
      npcId: quest.npcId!.toString(),
      quests: [quest],
    });
  }

  private releaseSpellRewards(reward: IQuestReward, itemContainer: IItemContainer): void {
    /*
     * TODO: implement when spells are supported
     */
  }
}
