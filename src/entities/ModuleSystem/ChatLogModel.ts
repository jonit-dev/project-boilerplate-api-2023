import { createLeanSchema } from "@providers/database/mongooseHelpers";
import { ChatMessageType, TypeHelper } from "@rpg-engine/shared";
import { ExtractDoc, Type, typedModel } from "ts-mongoose";

const chatLogSchema = createLeanSchema(
  {
    message: Type.string({ required: true }),
    emitter: Type.objectId({
      ref: "Character",
      index: true,
    }),
    type: Type.string({
      required: true,
      default: ChatMessageType.Global,
      enum: TypeHelper.enumToStringArray(ChatMessageType),
    }),
    x: Type.number({ required: true }),
    y: Type.number({ required: true }),
    scene: Type.string({ required: true }),
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export type IChatLog = ExtractDoc<typeof chatLogSchema>;

export const ChatLog = typedModel("ChatLog", chatLogSchema);
