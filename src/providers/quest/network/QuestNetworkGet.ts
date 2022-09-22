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
    for (const q of quests) {
      const hasRequiredStatus = await q.hasStatus(data.status, character.id);
      if (hasRequiredStatus) {
        filteredQuests.push(q as unknown as IQuest);
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
      if (data.status) {
        const hasRequiredStatus = await quest.hasStatus(data.status, character.id);
        if (hasRequiredStatus) {
          const filteredQuest = quest as unknown as IQuest;
          filteredQuest.status = data.status;
          filteredQuests.push(filteredQuest);
        }
      } else {
        // For a character, quests can have either status InProgress or Completed
        const isInProgress = await quest.hasStatus(QuestStatus.InProgress, character.id);
        const questData = quest as unknown as IQuest;
        isInProgress ? (questData.status = QuestStatus.InProgress) : (questData.status = QuestStatus.Completed);
        filteredQuests.push(questData);
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
}
