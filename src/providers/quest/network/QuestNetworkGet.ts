import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { INPC, NPC } from "@entities/ModuleNPC/NPCModel";
import { Quest, IQuest as IQuestModel } from "@entities/ModuleQuest/QuestModel";
import { QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  GRID_WIDTH,
  IGetQuests,
  IQuest,
  IQuestsResponse,
  IUIShowMessage,
  NPCMovementType,
  NPCTargetType,
  NPC_MAX_TALKING_DISTANCE_IN_GRID,
  QuestSocketEvents,
  QuestStatus,
  UISocketEvents,
  IQuestObjectiveKill,
  IQuestObjectiveInteraction,
  QuestType,
  IQuestReward,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";
import { Types } from "mongoose";

@provide(QuestNetworkGet)
export class QuestNetworkGet {
  constructor(
    private socketAuth: SocketAuth,
    private mathHelper: MathHelper,
    private socketMessaging: SocketMessaging
  ) {}

  public onGetQuests(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, QuestSocketEvents.GetQuests, async (data: IGetQuests, character) => {
      try {
        let questsResponse: IQuestsResponse | undefined;

        // Check if character is alive and not banned
        if (!character.isAlive) {
          throw new Error(`GetQuests > Character is dead! Character id: ${character.id}`);
        }

        if (character.isBanned) {
          throw new Error(`GetQuests > Character is banned! Character id: ${character.id}`);
        }

        if (data.npcId) {
          const npc = await NPC.findOne({
            _id: data.npcId,
          });

          if (!npc) {
            throw new Error(`GetQuests > NPC not found: ${data.npcId}`);
          }

          questsResponse = await this.getNPCQuests(npc, data, character);

          setTimeout(() => {
            // clear target and rollback movement type
            npc.currentMovementType = npc.originalMovementType;
            npc.targetCharacter = undefined;
            npc.targetType = NPCTargetType.Default;
            npc.save();
          }, 60 * 1000);
        } else if (data.characterId) {
          questsResponse = await this.getCharacterQuests(data, character);
        } else {
          throw new Error("GetQuests > need to provide either a npcId or a characterId");
        }

        if (questsResponse) {
          this.socketMessaging.sendEventToUser<IQuestsResponse>(
            character.channelId!,
            QuestSocketEvents.GetQuests,
            questsResponse
          );
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  private async getNPCQuests(npc: INPC, data: IGetQuests, character: ICharacter): Promise<IQuestsResponse | undefined> {
    if (!data.status) {
      throw new Error("GetQuests > Need to provide a quest status to get NPC's quests");
    }

    const distanceCharNPC = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, character.x, character.y);

    const isUnderRange = distanceCharNPC <= NPC_MAX_TALKING_DISTANCE_IN_GRID * GRID_WIDTH;
    if (!isUnderRange) {
      throw new Error(`NPC ${npc.name} out of range to ask about quests..`);
    }

    npc.currentMovementType = NPCMovementType.Stopped;
    npc.targetType = NPCTargetType.Talking;
    npc.targetCharacter = character._id;
    await npc.save();

    // get NPC's quests
    const quests = await Quest.find({ npcId: Types.ObjectId(data.npcId) });
    if (!quests) {
      throw new Error(`GetQuests > Quests not found for NPC id: ${data.npcId}`);
    }

    const filteredQuests: IQuest[] = [];
    for (const quest of quests) {
      const parsedQuest = await this.parseQuest(quest, character.id, data.status);
      if (parsedQuest) {
        filteredQuests.push(parsedQuest);
      }
    }

    if (!filteredQuests.length) {
      this.sendNoQuestsMessage(character);
      return;
    }

    return {
      npcId: npc._id,
      quests: filteredQuests,
    };
  }

  private async getCharacterQuests(data: IGetQuests, character: ICharacter): Promise<IQuestsResponse | undefined> {
    const filteredQuests: IQuest[] = [];

    // get Character's quests
    const questRecords = await QuestRecord.find({ character: Types.ObjectId(character.id) }).populate("quest");
    if (!questRecords) {
      return {
        quests: filteredQuests,
      };
    }

    // save found quests on a map to avoid duplicating records
    const questsMap = {};
    for (const qr of questRecords) {
      if (!qr.quest) {
        continue;
      }

      const quest = qr.quest as unknown as IQuestModel;
      if (questsMap[quest._id]) {
        continue;
      }

      questsMap[quest._id] = true;
      const objectives = await quest.objectivesDetails;
      const objData: any[] = [];

      for (const obj of objectives) {
        // Update kill count in objective
        if (obj.type === QuestType.Kill) {
          const killObj = obj as unknown as IQuestObjectiveKill;
          const data: IQuestObjectiveKill = {
            id: killObj.id,
            type: QuestType.Kill,
            status: QuestStatus.InProgress,
            killCountTarget: killObj.killCountTarget,
            creatureKeys: killObj.creatureKeys,
            killCount: 0,
          };
          if (obj._id.toString() === qr.objective.toString()) {
            data.killCount = qr.killCount || 0;
            if (data.killCount === data.killCountTarget) {
              data.status = QuestStatus.Completed;
            }
          }
          objData.push(data);
        }
        if (obj.type === QuestType.Interaction) {
          const intObj = obj as unknown as IQuestObjectiveInteraction;
          const data: IQuestObjectiveInteraction = {
            id: intObj.id,
            type: QuestType.Interaction,
            status: QuestStatus.InProgress,
            targetNPCkey: intObj.targetNPCkey,
          };
          objData.push(data);
        }
      }

      const parsedQuest = await this.parseQuest(quest, character.id, data.status, objData);
      if (parsedQuest) {
        filteredQuests.push(parsedQuest);
      }
    }

    return {
      quests: filteredQuests,
    };
  }

  private sendNoQuestsMessage(character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: "I don't have any quests for you right now.",
      type: "info",
    });
  }

  private async parseQuest(
    quest: IQuestModel,
    characterId: string,
    status: QuestStatus | undefined,
    objData?: any[]
  ): Promise<IQuest | undefined> {
    let response: IQuest | undefined;

    if (status) {
      const hasRequiredStatus = await quest.hasStatus(status, characterId);
      if (hasRequiredStatus) {
        response = {
          _id: quest._id,
          createdAt: quest.updatedAt.toString(),
          updatedAt: quest.updatedAt.toString(),
          key: quest.key,
          npcId: quest.npcId!.toString(),
          title: quest.title,
          description: quest.description,
          rewards: quest.rewards as unknown as IQuestReward[],
          objectives: objData || (quest.objectives as any[]),
          status,
        };
      }
    } else {
      response = {
        _id: quest._id,
        createdAt: quest.updatedAt.toString(),
        updatedAt: quest.updatedAt.toString(),
        key: quest.key,
        npcId: quest.npcId!.toString(),
        title: quest.title,
        description: quest.description,
        rewards: quest.rewards as unknown as IQuestReward[],
        objectives: objData || (quest.objectives as any[]),
      };

      if (await quest.hasStatus(QuestStatus.InProgress, characterId)) {
        response.status = QuestStatus.InProgress;
      } else if (await quest.hasStatus(QuestStatus.Pending, characterId)) {
        response.status = QuestStatus.Pending;
      } else {
        response.status = QuestStatus.Completed;
      }
    }

    return response;
  }
}
