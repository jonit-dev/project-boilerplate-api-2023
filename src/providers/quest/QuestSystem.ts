import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { IItemContainer, ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { IItem, Item } from "@entities/ModuleInventory/ItemModel";
import { IQuest, Quest } from "@entities/ModuleQuest/QuestModel";
import {
  IQuestObjectiveInteraction,
  IQuestObjectiveKill,
  QuestObjectiveInteraction,
  QuestObjectiveKill,
} from "@entities/ModuleQuest/QuestObjectiveModel";
import { QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { IQuestReward, QuestReward } from "@entities/ModuleQuest/QuestRewardModel";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { IUIShowMessage, QuestStatus, QuestType, UISocketEvents } from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";

@provide(QuestSystem)
export class QuestSystem {
  constructor(private socketMessaging: SocketMessaging) {}

  public async updateKillQuests(character: ICharacter, creatureKey: string): Promise<void> {
    const killObjectives = await this.getObjectives(character, QuestType.Kill);
    if (_.isEmpty(killObjectives)) {
      return;
    }
    const updatedQuest = await this.updateKillObjective(killObjectives as IQuestObjectiveKill[], creatureKey);
    if (!updatedQuest) {
      return;
    }

    if (await updatedQuest.hasStatus(QuestStatus.Completed)) {
      this.releaseRewards(updatedQuest, character);
    }
  }

  private async getObjectives(
    character: ICharacter,
    type: QuestType,
    status = QuestStatus.InProgress
  ): Promise<IQuestObjectiveInteraction[] | IQuestObjectiveKill[]> {
    const questRecords = await QuestRecord.find({ character: character.id });

    if (!questRecords.length) {
      return [] as IQuestObjectiveInteraction[] | IQuestObjectiveKill[];
    }

    switch (type) {
      case QuestType.Interaction:
        return QuestObjectiveInteraction.find({
          status,
          _id: { $in: questRecords.map((r) => r.objective) },
        });

      case QuestType.Kill:
        return QuestObjectiveKill.find({
          status,
          _id: { $in: questRecords.map((r) => r.objective) },
        });
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
   * @param objectives array of quest kill objectives
   * @param creatureKey key of the creature killed
   */
  private async updateKillObjective(
    objectives: IQuestObjectiveKill[],
    creatureKey: string
  ): Promise<IQuest | undefined> {
    // check for each objective if the creature key is within their
    // creatureKey array. If many cases, only update the first one
    for (const obj of objectives) {
      if (obj.creatureKeys!.indexOf(creatureKey) > -1) {
        obj.killCount++;
        if (obj.killCount === obj.killCountTarget) {
          obj.status = QuestStatus.Completed;
        }
        await obj.save();
        return (await Quest.findById(obj.quest)) as IQuest;
      }
    }
    return undefined;
  }

  /**
   * This function updates the interaction objective of a quest if npcKey is
   * equal to the targetNPCKey of one of the objectives. In such case,
   * returns the quest that is owner to the updated objective. If none is updated,
   * returns undefined
   *
   * @param objectives array of quest interaction objectives
   * @param npcKey key of npc that the charater interacted with
   */
  private async updateInteractionObjective(
    objectives: IQuestObjectiveInteraction[],
    npcKey: string
  ): Promise<IQuest | undefined> {
    // check for each objective if the npc key is the correspondiong npc
    // If many cases, only update the first one
    for (const obj of objectives) {
      if (obj.targetNPCKey! === npcKey) {
        obj.status = QuestStatus.Completed;
        await obj.save();
        return (await Quest.findById(obj.quest)) as IQuest;
      }
    }
    return undefined;
  }

  private async releaseRewards(quest: IQuest, character: ICharacter): Promise<void> {
    const rewards = await QuestReward.find({ _id: { $in: quest.rewards } });

    // Get character's backpack to store there the rewards
    const equipment = await Equipment.findById(character.equipment).populate("inventory");
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

    for (const reward of rewards) {
      await this.releaseItemRewards(reward, backpackContainer);
      // TODO implement when spells are supported
      // await this.releaseSpellRewards(reward, backpackContainer);
    }
    await backpackContainer.save();

    this.sendQuestCompletedEvent(quest, character);
  }

  private async releaseItemRewards(reward: IQuestReward, itemContainer: IItemContainer): Promise<void> {
    if (!reward.itemKeys) {
      return;
    }

    for (const itemKey of reward.itemKeys) {
      let freeSlotAvailable = true;
      const blueprintData = itemsBlueprintIndex[itemKey];
      if (!freeSlotAvailable) {
        break;
      }

      for (let i = 0; i < reward.qty; i++) {
        const rewardItem = new Item({ ...blueprintData });
        await rewardItem.save();

        const freeSlotId = itemContainer.firstAvailableSlotId;
        freeSlotAvailable = freeSlotId !== null;

        if (!freeSlotAvailable) {
          break;
        }

        itemContainer.slots[freeSlotId!] = rewardItem;
      }
    }
  }

  private sendQuestCompletedEvent(quest: IQuest, character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: `You have completed the quest '${quest.title}'!`,
      type: "info",
    });
  }

  private releaseSpellRewards(reward: IQuestReward, itemContainer: IItemContainer): void {
    /*
     * TODO: implement when spells are supported
     */
    // if (!reward.spellKeys) {
    //     return;
    // }
    // for (const spellKey of reward.spellKeys) {
    //     let freeSlotAvailable = true;
    //     const blueprintData = itemsBlueprintIndex[spellKey];
    //     if (!freeSlotAvailable) {
    //         break;
    //     }
    //     for (let i = 0; i < reward.qty; i++) {
    //         const rewardSpell = new Spell({ ...blueprintData });
    //         await rewardSpell.save();
    //         const freeSlotId = itemContainer.firstAvailableSlotId;
    //         freeSlotAvailable = freeSlotId !== null;
    //         if (!freeSlotAvailable) {
    //             break;
    //         }
    //         itemContainer.slots[freeSlotId!] = rewardSpell;
    //     }
    // }
  }
}
