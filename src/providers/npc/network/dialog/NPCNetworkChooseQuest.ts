import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { Quest, hasStatus } from "@entities/ModuleQuest/QuestModel";
import { QuestRecord } from "@entities/ModuleQuest/QuestRecordModel";
import { MathHelper } from "@providers/math/MathHelper";
import { SocketAuth } from "@providers/sockets/SocketAuth";
import { SocketMessaging } from "@providers/sockets/SocketMessaging";
import { SocketChannel } from "@providers/sockets/SocketsTypes";
import {
  GRID_WIDTH,
  IChooseQuest,
  IUIShowMessage,
  NPCMovementType,
  NPCTargetType,
  NPC_MAX_TALKING_DISTANCE_IN_GRID,
  QuestSocketEvents,
  QuestStatus,
  UISocketEvents,
} from "@rpg-engine/shared";
import { provide } from "inversify-binding-decorators";

@provide(NPCNetworkChooseQuest)
export class NPCNetworkChooseQuest {
  constructor(
    private socketAuth: SocketAuth,
    private mathHelper: MathHelper,
    private socketMessaging: SocketMessaging
  ) {}

  public onChooseQuest(channel: SocketChannel): void {
    this.socketAuth.authCharacterOn(channel, QuestSocketEvents.ChooseQuest, async (data: IChooseQuest, character) => {
      try {
        const npc = await NPC.findOne({
          _id: data.npcId,
        });

        if (!npc) {
          throw new Error(`ChooseQuest > NPC not found: ${data.npcId}`);
        }

        const quest = await Quest.findOne({
          _id: data.questId,
          npcId: data.npcId,
        });

        if (!quest) {
          throw new Error(`ChooseQuest > Quest not found: ${data.questId}`);
        }

        const isPending = await hasStatus(quest, QuestStatus.Pending);
        if (!isPending) {
          throw new Error(`ChooseQuest > Quest is not pending: ${data.questId}`);
        }

        const distanceCharNPC = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, character.x, character.y);

        const isUnderRange = distanceCharNPC <= NPC_MAX_TALKING_DISTANCE_IN_GRID * GRID_WIDTH;
        if (isUnderRange) {
          // Check if character is alive and not banned
          if (!character.isAlive) {
            throw new Error(`ChooseQuest > Character is dead! Character id: ${character.id}`);
          }

          if (character.isBanned) {
            throw new Error(`ChooseQuest > Character is banned! Character id: ${character.id}`);
          }

          npc.currentMovementType = NPCMovementType.Stopped;
          npc.targetType = NPCTargetType.Talking;
          npc.targetCharacter = character._id;
          await npc.save();

          // get quests objectives and update their status to InProgress
          // save quest record mapping character and objective/s
          const objectives = await quest.objectivesDetails;
          for (const obj of objectives) {
            const questRecord = new QuestRecord();
            questRecord.character = character._id;
            questRecord.objective = obj._id;
            await questRecord.save();

            obj.status = QuestStatus.InProgress;
            await obj.save();
          }

          this.sendQuestStartedMessage(character);

          setTimeout(() => {
            // clear target and rollback movement type
            npc.currentMovementType = npc.originalMovementType;
            npc.targetCharacter = undefined;
            npc.targetType = NPCTargetType.Default;
            npc.save();
          }, 60 * 1000);
        } else {
          throw new Error(`NPC ${npc.name} out of range to choose a quest..`);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  private sendQuestStartedMessage(character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: "You have started a new quest! Good luck!",
      type: "info",
    });
  }
}
