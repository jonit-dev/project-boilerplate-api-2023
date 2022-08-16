import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";
import { QuestType, QuestStatus } from "@rpg-engine/shared";

/** QUEST KILL OBJECTIVE **/

const questObjectiveKillSchema = createLeanSchema(
  {
    killCount: Type.number({ required: true }),
    killCountTarget: Type.number({ required: true }),
    creatureKeys: Type.array().of(Type.string()),
    type: Type.string({ required: true, default: QuestType.Kill }),
    status: Type.string({ required: true, default: QuestStatus.Pending }),
    quest: Type.objectId({ required: true, ref: "Quest" }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IQuestObjectiveKill = ExtractDoc<typeof questObjectiveKillSchema>;

export const QuestObjectiveKill = typedModel("QuestObjectiveKill", questObjectiveKillSchema);

/** QUEST INTERACTION OBJECTIVE **/

const questObjectiveInteractionSchema = createLeanSchema(
  {
    targetNPCKey: Type.string({ required: true }),
    type: Type.string({ required: true, default: QuestType.Interaction }),
    status: Type.string({ required: true, default: QuestStatus.Pending }),
    quest: Type.objectId({ required: true, ref: "Quest" }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IQuestObjectiveInteraction = ExtractDoc<typeof questObjectiveInteractionSchema>;

export const QuestObjectiveInteraction = typedModel("QuestObjectiveInteraction", questObjectiveInteractionSchema);
