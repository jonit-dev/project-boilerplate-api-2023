import { ICharacter } from "@entities/ModuleCharacter/CharacterModel";
import { NPC } from "@entities/ModuleNPC/NPCModel";
import { Quest } from "@entities/ModuleQuest/QuestModel";
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
        const npc = await NPC.findOne({
          _id: data.npcId,
        });

        if (!npc) {
          throw new Error(`GetQuests > NPC not found: ${data.npcId}`);
        }

        const distanceCharNPC = this.mathHelper.getDistanceBetweenPoints(npc.x, npc.y, character.x, character.y);

        const isUnderRange = distanceCharNPC <= NPC_MAX_TALKING_DISTANCE_IN_GRID * GRID_WIDTH;
        if (isUnderRange) {
          // Check if character is alive and not banned
          if (!character.isAlive) {
            throw new Error(`GetQuests > Character is dead! Character id: ${character.id}`);
          }

          if (character.isBanned) {
            throw new Error(`GetQuests > Character is banned! Character id: ${character.id}`);
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
            const hasRequiredStatus = await q.hasStatus(data.status);
            if (hasRequiredStatus) {
              filteredQuests.push(q as unknown as IQuest);
            }
          }

          if (!filteredQuests.length) {
            this.sendNoQuestsMessage(character);
            return;
          }

          this.socketMessaging.sendEventToUser<IQuestsResponse>(character.channelId!, QuestSocketEvents.GetQuests, {
            npcId: npc._id,
            quests: filteredQuests,
          });

          setTimeout(() => {
            // clear target and rollback movement type
            npc.currentMovementType = npc.originalMovementType;
            npc.targetCharacter = undefined;
            npc.targetType = NPCTargetType.Default;
            npc.save();
          }, 60 * 1000);
        } else {
          throw new Error(`NPC ${npc.name} out of range to ask about quests..`);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

  private sendNoQuestsMessage(character: ICharacter): void {
    this.socketMessaging.sendEventToUser<IUIShowMessage>(character.channelId!, UISocketEvents.ShowMessage, {
      message: "I don't have any quests for you right now.",
      type: "info",
    });
  }
}
