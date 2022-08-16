import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { Equipment } from "@entities/ModuleCharacter/EquipmentModel";
import { ItemContainer } from "@entities/ModuleInventory/ItemContainerModel";
import { Item, IItem as IItemModel } from "@entities/ModuleInventory/ItemModel";
import { IQuest as IQuestModel, Quest } from "@entities/ModuleQuest/QuestModel";
import {
  IQuestObjectiveInteraction,
  IQuestObjectiveKill,
  QuestObjectiveInteraction,
  QuestObjectiveKill,
} from "@entities/ModuleQuest/QuestObjectiveModel";
import { QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { IQuestReward, QuestReward } from "@entities/ModuleQuest/QuestRewardModel";
import { CharacterWeight } from "@providers/character/CharacterWeight";
import { itemsBlueprintIndex } from "@providers/item/data/index";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { EquipmentSlots } from "@providers/equipment/EquipmentSlots";
import {
  FromGridX,
  FromGridY,
  IEquipmentAndInventoryUpdatePayload,
  IItem,
  IItemContainer,
  IQuestsResponse,
  ItemSocketEvents,
  IUIShowMessage,
  QuestSocketEvents,
  QuestStatus,
  QuestType,
  ToGridX,
  ToGridY,
  UISocketEvents,
  IQuest,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import _ from "lodash";
import { IPosition, MovementHelper } from "@providers/movement/MovementHelper";
import { MathHelper } from "@providers/math/MathHelper";

@provide(QuestSystem)
export class QuestSystem {
  constructor(
    private socketMessaging: SocketMessaging,
    private characterWeight: CharacterWeight,
    private equipmentSlots: EquipmentSlots,
    private movementHelper: MovementHelper,
    private mathHelper: MathHelper
  ) {}

  public async updateQuests(type: QuestType, character: ICharacter, targetKey: string): Promise<void> {
    const objectives = await this.getObjectives(character, type);
    if (_.isEmpty(objectives)) {
      return;
    }

    let updatedQuest: IQuestModel | undefined;
    switch (type) {
      case QuestType.Kill:
        updatedQuest = await this.updateKillObjective(objectives as IQuestObjectiveKill[], targetKey);
        break;
      case QuestType.Interaction:
        updatedQuest = await this.updateInteractionObjective(objectives as IQuestObjectiveInteraction[], targetKey);
        break;
      default:
        throw new Error(`Invalid quest type ${type}`);
    }

    if (!updatedQuest) {
      return;
    }

    if (await updatedQuest.hasStatus(QuestStatus.Completed)) {
      await this.releaseRewards(updatedQuest as unknown as IQuest, character);
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
  ): Promise<IQuestModel | undefined> {
    // check for each objective if the creature key is within their
    // creatureKey array. If many cases, only update the first one
    for (const obj of objectives) {
      if (obj.creatureKeys!.indexOf(creatureKey) > -1) {
        obj.killCount++;
        if (obj.killCount === obj.killCountTarget) {
          obj.status = QuestStatus.Completed;
        }
        await obj.save();
        return (await Quest.findById(obj.quest)) as IQuestModel;
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
  ): Promise<IQuestModel | undefined> {
    // check for each objective if the npc key is the correspondiong npc
    // If many cases, only update the first one
    for (const obj of objectives) {
      if (obj.targetNPCKey! === npcKey) {
        obj.status = QuestStatus.Completed;
        await obj.save();
        return (await Quest.findById(obj.quest)) as IQuestModel;
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

    try {
      const overflowingRewards: IItemModel[] = [];
      for (const reward of rewards) {
        overflowingRewards.concat(
          await this.releaseItemRewards(reward, backpackContainer as unknown as IItemContainer)
        );
        // TODO implement when spells are supported
        // await this.releaseSpellRewards(reward, backpackContainer);
      }

      if (!_.isEmpty(overflowingRewards)) {
        // drop items on the floor
        // 1. get nearby grid points without solids
        const gridPoints = await this.getNearbyGridPoints(character, overflowingRewards.length);
        // 2. drop items on those grid points
        await this.dropItems(overflowingRewards, gridPoints, character.scene);
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
      const blueprintData = itemsBlueprintIndex[itemKey];

      for (let i = 0; i < reward.qty; i++) {
        let rewardItem = new Item({ ...blueprintData });
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

  /**
   * Get nearby grid points that are free (not solid or with items)
   * @param character character from which nearby grid points will be searched
   * @param pointsAmount amount of grid points to return
   */
  private async getNearbyGridPoints(character: ICharacter, pointsAmount: number): Promise<IPosition[]> {
    const result: IPosition[] = [];
    const circundatingPoints = this.mathHelper.getCircundatingGridPoints(
      { x: ToGridX(character.x), y: ToGridY(character.y) },
      2
    );
    for (const point of circundatingPoints) {
      const isSolid = await this.movementHelper.isSolid(character.scene, point.x, point.y, character.layer);
      if (!isSolid) {
        result.push(point);
      }
      if (result.length === pointsAmount) {
        break;
      }
    }
    return result;
  }

  private async dropItems(items: IItemModel[], droppintPoints: IPosition[], scene: string): Promise<void> {
    for (const i in droppintPoints) {
      items[i].x = FromGridX(droppintPoints[i].x);
      items[i].y = FromGridY(droppintPoints[i].y);
      items[i].scene = scene;
      await items[i].save();
    }
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
